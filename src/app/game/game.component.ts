import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {EnrichedPlayer} from '../model/player';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {StorageService} from '../service/storage.service';
import {MatDialog} from '@angular/material/dialog';
import {EditionDialogComponent} from '../edition-dialog/edition-dialog.component';
import {NavButtonsService} from '../service/nav-buttons.service';
import {ShareButtonService} from '../share-button/share-button.service';
import {TranslateService} from '@ngx-translate/core';
import {SocketService} from '../socket/socket.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GamesService} from '../service/games.service';
import {environment} from '../../environments/environment';

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

  private static cumSum(scores: (number | null)[]): { scoresCumSum: number[], total: number } {
    return scores.reduce(
      (acc, score) => ({scoresCumSum: [...acc.scoresCumSum, acc.total + score], total: acc.total + score}),
      {total: 0, scoresCumSum: [] as number[]},
    );
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageService: StorageService,
              private navButtonsService: NavButtonsService,
              private shareButtonService: ShareButtonService,
              private translateService: TranslateService,
              private gamesService: GamesService,
              private socket: SocketService,
              private dialog: MatDialog,
  ) {
    this.navButtonsService.navButtonClicked$('share')
      .pipe(
        withLatestFrom(this.game$, this.translateService.get('game.share.title'), this.translateService.get('game.share.text')),
        takeUntil(this.destroy$),
      )
      .subscribe(([, game, title, text]) => {
        if (game === null) {
          console.error('Trying to share but game is null?');
        } else if (game.gameId === 'offline') {
          this.gamesService.postNewGame(game)
            .pipe(filter(newGame => !!newGame), map(newGame => newGame.gameId), takeUntil(this.destroy$))
            .subscribe(newGameId => {
              this.router.navigate(['game', newGameId]).then(() => {
                this.shareButtonService.shareOrCopy(title, text, environment.websiteUrl + `/game/${newGameId}`);
              });
            });
        } else {
          this.shareButtonService.shareOrCopy(title, text, environment.websiteUrl + `/game/${game.gameId}`);
        }
      });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(map(params => params.get('gameId')), takeUntil(this.destroy$))
      .subscribe(gameId => this.gamesService.setCurrentGameId(gameId));
  }

  ngOnDestroy(): void {
    this.gamesService.setCurrentGameId(null);

    this.destroy$.next();
    this.destroy$.complete();
  }

  public addScore(p: number) {
    const currentGame = this.game$.getValue();
    this.editScoreOpen(p, currentGame.players[p].scores.length);
  }

  public removeScore(p: number) {
    const currentGame = this.game$.getValue();
    currentGame.players[p].scores.pop();
    this.gamesService.editGame(currentGame);
  }

  public editScoreOpen(p: number, i: number) {
    const current = this.game$.getValue().players[p].scores[i] ?? null;
    this.dialog.open(EditionDialogComponent, {data: {editScore: {current, p, i}}})
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
    this.gamesService.editGame(currentGame);
  }

  public editPlayerNameOpen(p: number) {
    const current = this.game$.getValue().players[p].name;
    this.dialog.open(EditionDialogComponent, {data: {editPlayerName: {current, p}}})
      .afterClosed()
      .pipe(filter(res => res !== undefined), takeUntil(this.destroy$))
      .subscribe(res => {
        this.editPlayerName(p, res);
      });
  }

  public editPlayerName(p: number, newName: string) {
    const currentGame = this.game$.getValue();
    currentGame.players[p].name = newName;
    this.gamesService.editGame(currentGame);
  }

  public addPlayer() {
    const currentGame = this.game$.getValue();
    this.gamesService.editGame({
      ...currentGame,
      players: [...currentGame.players, {name: `P${currentGame.players.length + 1}`, scores: []}],
    });
  }

  public removePlayer() {
    const currentGame = this.game$.getValue();
    currentGame.players.pop();
    this.gamesService.editGame(currentGame);
  }

  public editGameOpen() {
    const current = this.game$.getValue().name;
    this.dialog.open(EditionDialogComponent, {data: {editGame: {current}}})
      .afterClosed()
      .pipe(filter(res => res !== undefined), takeUntil(this.destroy$))
      .subscribe(res => {
        this.editGame(res);
      });
  }

  public editGame(newName: string) {
    const currentGame = this.game$.getValue();
    currentGame.name = newName;
    this.gamesService.editGame(currentGame);
  }

  public toggleWin() {
    const currentGame = this.game$.getValue();
    this.gamesService.editGame({...currentGame, lowerScoreWins: !currentGame.lowerScoreWins});
  }
}
