import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {ConfirmDialogComponent, ConfirmDialogData} from '../dialogs/confirm-dialog/confirm-dialog.component';
import {GameNameDialogComponent, GameNameDialogData} from '../dialogs/game-name-dialog/game-name-dialog.component';
import {
  PlayerNameDialogComponent,
  PlayerNameDialogData,
  PlayerNameDialogResult
} from '../dialogs/player-name-dialog/player-name-dialog.component';
import {EditScoreDialogData, ScoreDialogComponent} from '../dialogs/score-dialog/score-dialog.component';
import {GameType, IGame} from '../model/game';
import {EnrichedPlayer} from '../model/player';
import {GameSettingsService} from '../service/game-settings.service';
import {GamesService} from '../service/games.service';
import {NavButtonsService} from '../service/nav-buttons.service';
import {ShareButtonService} from '../share-button/share-button.service';
import {SocketService} from '../socket/socket.service';
import {StorageService} from '../storage/storage.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  public game$ = this.gamesService.currentGame$;

  public players$: Observable<EnrichedPlayer[]> = this.game$.pipe(
    filter(game => game !== null),
    map(game => {
      const playersNoRank = game.players.map(player => ({
        ...player,
        track: `${player.name}_${player.scores}`,
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

  public connectionError$ = this.socket.connectionError$;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageService: StorageService,
              private navButtonsService: NavButtonsService,
              private gameSettingsService: GameSettingsService,
              private shareButtonService: ShareButtonService,
              private translateService: TranslateService,
              private gamesService: GamesService,
              private socket: SocketService,
              private dialog: MatDialog,
              @Inject(APP_CONFIG) private config: AppConfig,
  ) {
  }

  private static cumSum(scores: (number | null)[]): { scoresCumSum: number[], total: number } {
    return scores.reduce(
      (acc, score) => ({scoresCumSum: [...acc.scoresCumSum, acc.total + score], total: acc.total + score}),
      {total: 0, scoresCumSum: [] as number[]},
    );
  }

  ngOnInit(): void {
    this.navButtonsService.navButtonClicked$()
      .pipe(
        withLatestFrom(this.game$),
        takeUntil(this.destroy$),
      )
      .subscribe(([btn, game]) => {
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
      .pipe(map(params => params.get('gameId')), takeUntil(this.destroy$))
      .subscribe(gameId => this.gamesService.setCurrentGameId(gameId ?? 'offline'));

    this.gameSettingsService.lowerScoreWins$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lowerScoreWins => this.setLowerScoreWins(lowerScoreWins));

    this.gameSettingsService.gameType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(gameType => this.setGameTypeOpen(gameType));
  }

  ngOnDestroy(): void {
    this.gamesService.setCurrentGameId(null);

    this.destroy$.next();
    this.destroy$.complete();
  }

  public editGameOpen() {
    const data: GameNameDialogData = {name: this.game$.getValue().name};
    this.dialog.open(GameNameDialogComponent, {data})
      .afterClosed()
      .pipe(filter(res => res !== undefined), takeUntil(this.destroy$))
      .subscribe(res => {
        this.editGame(res);
      });
  }

  public addPlayer() {
    const currentGame = this.game$.getValue();
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

  public editPlayerNameOpen(p: number, isNew: boolean = false) {
    const data: PlayerNameDialogData = {name: this.game$.getValue().players[p].name, isNew};
    this.dialog.open<PlayerNameDialogComponent, PlayerNameDialogData, PlayerNameDialogResult>(PlayerNameDialogComponent, {data})
      .afterClosed()
      .pipe(filter(res => !!res), takeUntil(this.destroy$))
      .subscribe(res => {
        this.editPlayerName(p, res);
      });
  }

  public removePlayer() {
    const currentGame = this.game$.getValue();
    const currentNbPlayers = currentGame.players.length;
    if (currentNbPlayers === 0) {
      return;
    }
    const lastPlayer = currentGame.players[currentNbPlayers - 1];
    if (lastPlayer.scores.filter(s => s !== null).length > 0) {
      const data: ConfirmDialogData = {
        title: this.translateService.instant('game.remove-player-dialog.title', {player: lastPlayer.name}),
        message: this.translateService.instant('game.remove-player-dialog.message'),
        confirm: this.translateService.instant('game.remove-player-dialog.confirm'),
        dismiss: this.translateService.instant('game.remove-player-dialog.dismiss'),
      };
      this.dialog.open(ConfirmDialogComponent, {data})
        .afterClosed()
        .pipe(filter(res => !!res), takeUntil(this.destroy$))
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

  public addScore(p: number) {
    const currentGame = this.game$.getValue();
    this.editScoreOpen(p, currentGame.players[p].scores.length, true);
  }

  public editScoreOpen(p: number, i: number, isNew: boolean = false) {
    const data: EditScoreDialogData = {score: this.game$.getValue().players[p].scores[i] ?? null, isNew};
    this.dialog.open(ScoreDialogComponent, {data})
      .afterClosed()
      .pipe(filter(res => res !== undefined), takeUntil(this.destroy$))
      .subscribe(res => {
        this.editScore(p, i, res);
      });
  }

  public editScore(p: number, i: number, s: number) {
    const currentGame = this.game$.getValue();
    if (i === currentGame.players[p].scores.length) {
      currentGame.players[p].scores.push(s);
    } else {
      currentGame.players[p].scores[i] = s;
    }
    this.gamesService.gameEditScore(currentGame.gameId, p, i, s);
    this.gamesService.updateSavedGame(currentGame);
  }

  public removeScore(p: number) {
    const currentGame = this.game$.getValue();
    currentGame.players[p].scores.pop();
    this.gamesService.gameRemoveScore(currentGame.gameId, p, currentGame.players[p].scores.length);
    this.gamesService.updateSavedGame(currentGame);
  }

  public addScoreLine() {
    const currentGame = this.game$.getValue();
    this.gamesService.gameEditScore(currentGame.gameId, -1, currentGame.players[0].scores.length, 0);
    const increasedScoreLength = Math.max(...currentGame.players.map(p => p.scores.length)) + 1;
    currentGame.players.forEach(p => p.scores.push(...new Array(increasedScoreLength - p.scores.length).fill(0)));
    this.gamesService.updateSavedGame(currentGame);
  }

  public removeScoreLine() {
    const currentGame = this.game$.getValue();
    if (currentGame.players.length === 0) {
      return;
    }
    const maxScoreLength = Math.max(...currentGame.players.map(p => p.scores.length));
    if (currentGame.players.filter(p => p.scores[maxScoreLength - 1] !== 0).length > 0) {
      const data: ConfirmDialogData = {
        title: this.translateService.instant('game.remove-score-line-dialog.title'),
        message: this.translateService.instant('game.remove-score-line-dialog.message'),
        confirm: this.translateService.instant('game.remove-score-line-dialog.confirm'),
        dismiss: this.translateService.instant('game.remove-score-line-dialog.dismiss'),
      };
      this.dialog.open(ConfirmDialogComponent, {data})
        .afterClosed()
        .pipe(filter(res => !!res), takeUntil(this.destroy$))
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

  public playerTrackByFn(index: number, player: EnrichedPlayer): string {
    return `${player.name}:${player.total}:${player.rank}:${player.last}`;
  }

  public scoreTrackByFn(index: number, score: number): number {
    return score;
  }

  private editGame(newName: string) {
    const currentGame = this.game$.getValue();
    currentGame.name = newName;
    this.gamesService.gameEditName(currentGame.gameId, newName);
    this.gamesService.updateSavedGame(currentGame);
  }

  private setLowerScoreWins(lowerScoreWins: boolean) {
    const currentGame = this.game$.getValue();
    currentGame.lowerScoreWins = lowerScoreWins;
    this.gamesService.gameEditWin(currentGame.gameId, currentGame.lowerScoreWins);
    this.gamesService.updateSavedGame(currentGame);
  }

  private setGameTypeOpen(gameType: GameType) {
    if (gameType === 'winOrLose') {
      const data: ConfirmDialogData = {
        title: this.translateService.instant('game.change-game-type-dialog.title'),
        message: this.translateService.instant('game.change-game-type-dialog.message'),
        confirm: this.translateService.instant('game.change-game-type-dialog.confirm'),
        dismiss: this.translateService.instant('game.change-game-type-dialog.dismiss'),
      };
      this.dialog.open(ConfirmDialogComponent, {data})
        .afterClosed()
        .pipe(filter(res => !!res), takeUntil(this.destroy$))
        .subscribe(() => this.editGameType(gameType));
    } else {
      this.editGameType(gameType);
    }
  }

  private editGameType(gameType: GameType) {
    const currentGame = this.game$.getValue();
    currentGame.gameType = gameType;
    this.gamesService.gameEditGameType(currentGame.gameId, gameType);
    this.gamesService.updateSavedGame(currentGame);
  }

  private editPlayerName(p: number, newName: string) {
    const currentGame = this.game$.getValue();
    currentGame.players[p].name = newName;
    this.gamesService.gameEditPlayer(currentGame.gameId, p, newName);
    this.gamesService.updateSavedGame(currentGame);
  }

  private shareGame(game: IGame | null) {
    const shareTitle = this.translateService.instant('game.share.title');
    const shareText = this.translateService.instant('game.share.text');
    if (game === null) {
      console.error('Trying to share but game is null?');
    } else if (game.gameId === 'offline') {
      this.gamesService.postNewGame(game)
        .pipe(filter(newGame => !!newGame), map(newGame => newGame.gameId), takeUntil(this.destroy$))
        .subscribe(newGameId => {
          this.router.navigate(['game', newGameId]).then(() => {
            this.shareButtonService.shareOrCopy(shareTitle, shareText, `${this.config.websiteUrl}/game/${newGameId}`);
          });
        });
    } else {
      this.shareButtonService.shareOrCopy(shareTitle, shareText, `${this.config.websiteUrl}/game/${game.gameId}`);
    }
  }

  private duplicateGame(game: IGame | null) {
    if (game === null) {
      console.error('Trying to duplicate but game is null?');
    } else if (game.gameId === 'offline') {
      console.error('Trying to duplicate but game is offline?');
    } else {
      this.gamesService.duplicateGame(game.gameId)
        .pipe(filter(newGame => !!newGame), map(newGame => newGame.gameId), takeUntil(this.destroy$))
        .subscribe(newGameId => {
          this.router.navigate(['game', newGameId]).catch(err => console.error('Could not navigate after duplication?', err));
        });
    }
  }

  private saveOffline(game: IGame | null) {
    if (game === null) {
      console.error('Trying to save offline but game is null?');
    } else if (game.gameId === 'offline') {
      console.error('Trying to save offline but game is already offline?');
    } else {
      game.gameId = 'offline';
      this.gamesService.saveOfflineGameToStorage(game);
      this.router.navigate(['game', 'offline']).catch(err => console.error('Could not navigate after save offline?', err));
    }
  }
}
