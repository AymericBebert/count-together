import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from '../model/game';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {EnrichedPlayer} from '../model/player';
import {debounceTime, filter, map, takeUntil} from 'rxjs/operators';
import {StorageService} from '../service/storage.service';
import {MatDialog} from '@angular/material/dialog';
import {EditionDialogComponent} from '../edition-dialog/edition-dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  public game$ = new BehaviorSubject<Game>({
    id: 'offline',
    name: 'Test Game',
    lowerScoreWins: true,
    players: [
      {
        name: 'Aymeric',
        scores: [12, 5, 0, 4],
      },
      {
        name: 'Loulou',
        scores: [15, 7, 3, 2],
      },
      {
        name: 'Cloclo',
        scores: [24, -5, 12, null],
      },
    ],
  });

  public players$: Observable<EnrichedPlayer[]> = this.game$.pipe(
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
          last: player.total === totals[totals.length - 1],
        };
      });
    }),
  );

  private destroy$ = new Subject<void>();

  private static cumSum(scores: (number | null)[]): { scoresCumSum: number[], total: number } {
    return scores.reduce(
      (acc, score) => ({scoresCumSum: [...acc.scoresCumSum, acc.total + score], total: acc.total + score}),
      {total: 0, scoresCumSum: [] as number[]},
    );
  }

  constructor(private storageService: StorageService,
              private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    const gameFromStorage = this.storageService.getItem('offlineGame');
    if (gameFromStorage) {
      try {
        this.game$.next(JSON.parse(gameFromStorage));
      } catch (err) {
        console.error('Could not parse game fron storage:', err);
      }
    }

    this.game$
      .pipe(filter(game => game.id === 'offline'), debounceTime(500), takeUntil(this.destroy$))
      .subscribe(game => {
        this.storageService.setItem('offlineGame', JSON.stringify(game));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addScore(p: number) {
    const currentGame = this.game$.getValue();
    this.editScoreOpen(p, currentGame.players[p].scores.length);
  }

  removeScore(p: number) {
    const currentGame = this.game$.getValue();
    currentGame.players[p].scores.pop();
    this.game$.next(currentGame);
  }

  editScoreOpen(p: number, i: number) {
    const current = this.game$.getValue().players[p].scores[i] ?? null;
    this.dialog.open(EditionDialogComponent, {data: {editScore: {current, p, i}}})
      .afterClosed()
      .pipe(filter(res => res !== undefined), takeUntil(this.destroy$))
      .subscribe(res => {
        this.editScore(p, i, res);
      });
  }

  editScore(p: number, i: number, s: number) {
    const currentGame = this.game$.getValue();
    if (i === currentGame.players[p].scores.length) {
      currentGame.players[p].scores.push(s);
    } else {
      currentGame.players[p].scores[i] = s;
    }
    this.game$.next(currentGame);
  }

  editPlayerNameOpen(p: number) {
    const current = this.game$.getValue().players[p].name;
    this.dialog.open(EditionDialogComponent, {data: {editPlayerName: {current, p}}})
      .afterClosed()
      .pipe(filter(res => res !== undefined), takeUntil(this.destroy$))
      .subscribe(res => {
        this.editPlayerName(p, res);
      });
  }

  editPlayerName(p: number, newName: string) {
    const currentGame = this.game$.getValue();
    currentGame.players[p].name = newName;
    this.game$.next(currentGame);
  }

  addPlayer() {
    const currentGame = this.game$.getValue();
    this.game$.next({
      ...currentGame,
      players: [...currentGame.players, {name: `P${currentGame.players.length + 1}`, scores: []}],
    });
  }

  removePlayer() {
    const currentGame = this.game$.getValue();
    currentGame.players.pop();
    this.game$.next(currentGame);
  }

  editGameOpen() {
    const current = this.game$.getValue().name;
    this.dialog.open(EditionDialogComponent, {data: {editGame: {current}}})
      .afterClosed()
      .pipe(filter(res => res !== undefined), takeUntil(this.destroy$))
      .subscribe(res => {
        this.editGame(res);
      });
  }

  editGame(newName: string) {
    const currentGame = this.game$.getValue();
    currentGame.name = newName;
    this.game$.next(currentGame);
  }

  toggleWin() {
    const currentGame = this.game$.getValue();
    this.game$.next({...currentGame, lowerScoreWins: !currentGame.lowerScoreWins});
  }
}
