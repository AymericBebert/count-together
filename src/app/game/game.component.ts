import {AsyncPipe} from '@angular/common';
import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {filter, map, withLatestFrom} from 'rxjs/operators';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {ConfirmDialogComponent, ConfirmDialogData} from '../dialogs/confirm-dialog/confirm-dialog.component';
import {GameNameDialogComponent, GameNameDialogData} from '../dialogs/game-name-dialog/game-name-dialog.component';
import {
  PlayerNameDialogComponent,
  PlayerNameDialogData,
  PlayerNameDialogResult
} from '../dialogs/player-name-dialog/player-name-dialog.component';
import {EditScoreDialogData, ScoreDialogComponent} from '../dialogs/score-dialog/score-dialog.component';
import {GameType, IGame, PlayerEdition} from '../model/game';
import {EnrichedPlayer} from '../model/player';
import {RankIconComponent} from '../rank-icon/rank-icon.component';
import {GameSettingsService} from '../service/game-settings.service';
import {GamesService} from '../service/games.service';
import {NavButtonsService} from '../service/nav-buttons.service';
import {ShareService} from '../share/share.service';
import {SocketService} from '../socket/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    AsyncPipe,
    TranslateModule,
    RankIconComponent,
    MatButtonModule,
    MatIconModule,
  ],
})
export class GameComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly gameSettingsService = inject(GameSettingsService);
  private readonly shareService = inject(ShareService);
  private readonly translate = inject(TranslateService);
  private readonly gamesService = inject(GamesService);
  private readonly socket = inject(SocketService);
  private readonly dialog = inject(MatDialog);
  private readonly config = inject<AppConfig>(APP_CONFIG);

  public readonly game$ = this.gamesService.currentGame$;

  public readonly players$: Observable<EnrichedPlayer[]> = this.game$.pipe(
    filter((game): game is IGame => !!game),
    map(game => {
      const playersNoRank = game.players.map(player => ({
        ...player,
        track: `${player.name}_${player.scores.toString()}`,
        ...GameComponent.cumSum(player.scores),
      }));
      const totals = playersNoRank.map(player => player.total).sort((a, b) => (a ?? 0) - (b ?? 0));
      if (!game.lowerScoreWins) {
        totals.reverse();
      }
      return playersNoRank.map(player => {
        const newScores = [...player.scores];
        return {
          ...player,
          scores: newScores,
          rank: totals.indexOf(player.total) + 1,
          last: player.total !== totals[0] && player.total === totals[totals.length - 1],
        };
      });
    }),
  );

  public readonly connectionError = toSignal(this.socket.connectionError$, {initialValue: false});

  private static cumSum(scores: (number | null)[]): { scoresCumSum: number[], total: number } {
    return scores.reduce(
      (acc, score) => ({
        scoresCumSum: [...acc.scoresCumSum, acc.total + (score || 0)],
        total: acc.total + (score || 0),
      }),
      {total: 0, scoresCumSum: [] as number[]},
    );
  }

  constructor(private readonly destroyRef: DestroyRef) {
    this.destroyRef.onDestroy(() => this.gamesService.setCurrentGameId(null));
  }

  ngOnInit(): void {
    this.navButtonsService.navButtonClicked$()
      .pipe(
        withLatestFrom(this.game$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([btn, game]) => {
        if (!game) {
          throw new Error('Trying to click nav button but game is null?');
        }
        switch (btn) {
          case 'share':
            this.shareGame(game);
            break;
          case 'nav-tool.wheel':
            this.router.navigate(['wheel'], {
              relativeTo: this.route,
              queryParams: {names: game.players.map(p => p.name).join(',')},
            }).catch(err => console.error('Navigation error', err));
            break;
          case 'nav-tool.sound-share':
            this.router.navigate(['sound-share'], {
              relativeTo: this.route,
            }).catch(err => console.error('Navigation error', err));
            break;
          case 'nav-tool.duplicate':
            this.duplicateGame(game);
            break;
          case 'nav-tool.save-offline':
            this.saveOffline(game);
            break;
        }
      });

    this.route.paramMap
      .pipe(map(params => params.get('gameId')), takeUntilDestroyed(this.destroyRef))
      .subscribe(gameId => this.gamesService.setCurrentGameId(gameId ?? 'offline'));

    this.gameSettingsService.lowerScoreWins$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lowerScoreWins => this.setLowerScoreWins(lowerScoreWins));

    this.gameSettingsService.gameType$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(gameType => this.setGameTypeOpen(gameType));

    this.gameSettingsService.playerEdition$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(playerEdition => this.editPlayers(playerEdition));
  }

  public editGameOpen(): void {
    const currentGame = this.gameOrThrow;
    this.dialog.open<GameNameDialogComponent, GameNameDialogData, string>(
      GameNameDialogComponent,
      {data: {name: currentGame.name}},
    )
      .afterClosed()
      .pipe(filter(res => res !== undefined), takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.editGame(res);
      });
  }

  public addPlayer(): void {
    const currentGame = this.gameOrThrow;
    const newPlayerIndex = currentGame.players.length;
    const newPlayerName = `P${newPlayerIndex + 1}`;
    currentGame.players.push({name: newPlayerName, scores: []});
    if (currentGame.gameType === 'smallScores' || currentGame.gameType === 'winOrLose') {
      const maxScoreLength = Math.max(...currentGame.players.map(p => p.scores.length));
      currentGame.players[currentGame.players.length - 1].scores.push(...new Array(maxScoreLength).fill(0));
    }
    this.gamesService.gameEditPlayer(currentGame.gameId, newPlayerIndex, newPlayerName);
    this.gamesService.updateSavedGame(currentGame);
    this.editPlayerNameOpen(currentGame.players.length - 1, true);
  }

  public editPlayerNameOpen(p: number, isNew = false): void {
    this.dialog.open<PlayerNameDialogComponent, PlayerNameDialogData, PlayerNameDialogResult>(
      PlayerNameDialogComponent,
      {data: {name: this.gameOrThrow.players[p].name, isNew}},
    )
      .afterClosed()
      .pipe(filter((res): res is string => !!res), takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.editPlayerName(p, res);
      });
  }

  public removePlayer(): void {
    const currentGame = this.gameOrThrow;
    const currentNbPlayers = currentGame.players.length;
    if (currentNbPlayers === 0) {
      return;
    }
    const lastPlayer = currentGame.players[currentNbPlayers - 1];
    if (lastPlayer.scores.filter(s => s !== null).length > 0) {
      this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
        ConfirmDialogComponent,
        {
          data: {
            title: this.translate.instant('game.remove-player-dialog.title', {player: lastPlayer.name}),
            message: this.translate.instant('game.remove-player-dialog.message'),
            confirm: this.translate.instant('game.remove-player-dialog.confirm'),
            dismiss: this.translate.instant('game.remove-player-dialog.dismiss'),
          },
        },
      )
        .afterClosed()
        .pipe(filter(res => !!res), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          currentGame.players.pop();
          this.gamesService.gameRemovePlayer(currentGame.gameId, currentNbPlayers - 1);
          this.gamesService.updateSavedGame(currentGame);
        });
    } else {
      currentGame.players.pop();
      this.gamesService.gameRemovePlayer(currentGame.gameId, currentNbPlayers - 1);
      this.gamesService.updateSavedGame(currentGame);
    }
  }

  public addScore(p: number): void {
    const currentGame = this.gameOrThrow;
    this.editScoreOpen(p, currentGame.players[p].scores.length, true);
  }

  public editScoreOpen(p: number, i: number, isNew = false): void {
    this.dialog.open<ScoreDialogComponent, EditScoreDialogData, number | null>(
      ScoreDialogComponent,
      {data: {score: this.gameOrThrow.players[p].scores[i] ?? null, isNew}},
    )
      .afterClosed()
      .pipe(filter(res => res !== undefined), takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.editScore(p, i, res);
      });
  }

  public editScore(p: number, i: number, s: number | null): void {
    const currentGame = this.gameOrThrow;
    if (i === currentGame.players[p].scores.length) {
      currentGame.players[p].scores.push(s);
    } else {
      currentGame.players[p].scores[i] = s;
    }
    this.gamesService.gameEditScore(currentGame.gameId, p, i, s);
    this.gamesService.updateSavedGame(currentGame);
  }

  public removeScore(p: number): void {
    const currentGame = this.gameOrThrow;
    const player = currentGame.players[p];
    if (player.scores.at(-1)) {
      this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
        ConfirmDialogComponent,
        {
          data: {
            title: this.translate.instant('game.remove-score-dialog.title', {player: player.name}),
            message: this.translate.instant('game.remove-score-dialog.message'),
            confirm: this.translate.instant('game.remove-score-dialog.confirm'),
            dismiss: this.translate.instant('game.remove-score-dialog.dismiss'),
          },
        },
      )
        .afterClosed()
        .pipe(filter(res => !!res), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.doRemoveScore(currentGame, p));
    } else {
      this.doRemoveScore(currentGame, p);
    }
  }

  public doRemoveScore(currentGame: IGame, p: number): void {
    currentGame.players[p].scores.pop();
    this.gamesService.gameRemoveScore(currentGame.gameId, p, currentGame.players[p].scores.length);
    this.gamesService.updateSavedGame(currentGame);
  }

  public addScoreLine(): void {
    const currentGame = this.gameOrThrow;
    this.gamesService.gameEditScore(currentGame.gameId, -1, currentGame.players[0].scores.length, 0);
    const increasedScoreLength = Math.max(...currentGame.players.map(p => p.scores.length)) + 1;
    currentGame.players.forEach(p => p.scores.push(...new Array(increasedScoreLength - p.scores.length).fill(0)));
    this.gamesService.updateSavedGame(currentGame);
  }

  public removeScoreLine(): void {
    const currentGame = this.gameOrThrow;
    if (currentGame.players.length === 0) {
      return;
    }
    const maxScoreLength = Math.max(...currentGame.players.map(p => p.scores.length));
    if (currentGame.players.filter(p => p.scores[maxScoreLength - 1] !== 0).length > 0) {
      this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
        ConfirmDialogComponent,
        {
          data: {
            title: this.translate.instant('game.remove-score-line-dialog.title'),
            message: this.translate.instant('game.remove-score-line-dialog.message'),
            confirm: this.translate.instant('game.remove-score-line-dialog.confirm'),
            dismiss: this.translate.instant('game.remove-score-line-dialog.dismiss'),
          },
        },
      )
        .afterClosed()
        .pipe(filter(res => !!res), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          currentGame.players.forEach(p => p.scores.pop());
          this.gamesService.gameRemoveScore(currentGame.gameId, -1, currentGame.players[0].scores.length);
          this.gamesService.updateSavedGame(currentGame);
        });
    } else {
      currentGame.players.forEach(p => p.scores.pop());
      this.gamesService.gameRemoveScore(currentGame.gameId, -1, currentGame.players[0].scores.length);
      this.gamesService.updateSavedGame(currentGame);
    }
  }

  public playerTrackByFn(player: EnrichedPlayer): string {
    return `${player.name}:${player.total}:${player.rank}:${player.last}`;
  }

  private get gameOrThrow(): IGame {
    const game = this.game$.getValue();
    if (game) {
      return game;
    }
    throw new Error('Trying to get game but game is null');
  }

  private editGame(newName: string): void {
    const currentGame = this.gameOrThrow;
    currentGame.name = newName;
    this.gamesService.gameEditName(currentGame.gameId, newName);
    this.gamesService.updateSavedGame(currentGame);
  }

  private setLowerScoreWins(lowerScoreWins: boolean): void {
    const currentGame = this.gameOrThrow;
    currentGame.lowerScoreWins = lowerScoreWins;
    this.gamesService.gameEditWin(currentGame.gameId, currentGame.lowerScoreWins);
    this.gamesService.updateSavedGame(currentGame);
  }

  private setGameTypeOpen(gameType: GameType): void {
    if (gameType === 'winOrLose') {
      this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
        ConfirmDialogComponent,
        {
          data: {
            title: this.translate.instant('game.change-game-type-dialog.title'),
            message: this.translate.instant('game.change-game-type-dialog.message'),
            confirm: this.translate.instant('game.change-game-type-dialog.confirm'),
            dismiss: this.translate.instant('game.change-game-type-dialog.dismiss'),
          },
        },
      )
        .afterClosed()
        .pipe(filter(res => !!res), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.editGameType(gameType));
    } else {
      this.editGameType(gameType);
    }
  }

  private editGameType(gameType: GameType): void {
    const currentGame = this.gameOrThrow;
    currentGame.gameType = gameType;
    this.gamesService.gameEditGameType(currentGame.gameId, gameType);
    this.gamesService.updateSavedGame(currentGame);
  }

  private editPlayerName(p: number, newName: string): void {
    const currentGame = this.gameOrThrow;
    currentGame.players[p].name = newName;
    this.gamesService.gameEditPlayer(currentGame.gameId, p, newName);
    this.gamesService.updateSavedGame(currentGame);
  }

  private editPlayers(players: PlayerEdition[]): void {
    const currentGame = this.gameOrThrow;
    const oldScores = currentGame.players.map(p => p.scores);
    currentGame.players = players.map(e => e.oldPlayerId >= 0 && oldScores[e.oldPlayerId]
      ? {name: e.playerName, scores: oldScores[e.oldPlayerId]}
      : {name: e.playerName, scores: []}
    );
    if (currentGame.gameType === 'smallScores' || currentGame.gameType === 'winOrLose') {
      const maxScoreLength = Math.max(...currentGame.players.map(p => p.scores.length));
      for (const player of currentGame.players) {
        if (player.scores.length < maxScoreLength) {
          player.scores.push(...new Array<number>(maxScoreLength - player.scores.length).fill(0));
        }
      }
    }
    this.gamesService.gameEditPlayers(currentGame.gameId, players);
    this.gamesService.updateSavedGame(currentGame);
  }

  private shareGame(game: IGame | null): void {
    const shareTitle = this.translate.instant('game.share.title');
    const shareText = this.translate.instant('game.share.text');
    if (game === null) {
      console.error('Trying to share but game is null?');
    } else if (game.gameId === 'offline') {
      this.gamesService.postNewGame$(game)
        .pipe(filter(newGame => !!newGame), map(newGame => newGame.gameId), takeUntilDestroyed(this.destroyRef))
        .subscribe(newGameId => {
          this.router.navigate(['game', newGameId]).then(() => {
            this.shareService.shareOrCopy(shareTitle, shareText, `${this.config.websiteUrl}/game/${newGameId}`);
          });
        });
    } else {
      this.shareService.shareOrCopy(shareTitle, shareText, `${this.config.websiteUrl}/game/${game.gameId}`);
    }
  }

  private duplicateGame(game: IGame | null): void {
    if (game === null) {
      console.error('Trying to duplicate but game is null?');
    } else if (game.gameId === 'offline') {
      console.error('Trying to duplicate but game is offline?');
    } else {
      this.gamesService.duplicateGame$(game.gameId)
        .pipe(filter(newGame => !!newGame), map(newGame => newGame.gameId), takeUntilDestroyed(this.destroyRef))
        .subscribe(newGameId => {
          this.router.navigate(['game', newGameId])
            .catch(err => console.error('Could not navigate after duplication?', err));
        });
    }
  }

  private saveOffline(game: IGame | null): void {
    if (game === null) {
      console.error('Trying to save offline but game is null?');
    } else if (game.gameId === 'offline') {
      console.error('Trying to save offline but game is already offline?');
    } else {
      game.gameId = 'offline';
      this.gamesService.saveOfflineGameToStorage(game);
      this.router.navigate(['game', 'offline'])
        .catch(err => console.error('Could not navigate after save offline?', err));
    }
  }
}
