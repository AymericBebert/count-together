import {DestroyRef, inject, Injectable} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {delay, filter, map, skip} from 'rxjs/operators';
import {
  NewGameDialogComponent,
  NewGameDialogData,
  NewGameDialogResult
} from '../dialogs/new-game-dialog/new-game-dialog.component';
import {GameType, IGameEditTurn, IGameSettings, PlayerEdition} from '../model/game';
import {GamesService} from './games.service';

@Injectable({
  providedIn: 'root',
})
export class GameSettingsService {
  private readonly gamesService = inject(GamesService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public readonly gameSettings$: Observable<IGameSettings | null> = this.gamesService.currentGame$.pipe(
    delay(0),
    map(g => g ? {
      lowerScoreWins: g.lowerScoreWins,
      gameType: g.gameType,
      isTurnBased: g.isTurnBased,
      showTurnNumber: g.showTurnNumber,
      turnNumberOffset: g.turnNumberOffset,
    } : null),
  );

  private readonly _lowerScoreWins$ = new Subject<boolean>();
  public readonly lowerScoreWins$ = this._lowerScoreWins$.asObservable();

  private readonly _gameType$ = new Subject<GameType>();
  public readonly gameType$ = this._gameType$.asObservable();

  private readonly _isTurnBased$ = new Subject<IGameEditTurn>();
  public readonly isTurnBased$ = this._isTurnBased$.asObservable();

  private readonly _playerEdition$ = new Subject<PlayerEdition[]>();
  public readonly playerEdition$ = this._playerEdition$.asObservable();

  public setLowerScoreWins(lowerScoreWins: boolean): void {
    this._lowerScoreWins$.next(lowerScoreWins);
  }

  public setGameType(gameType: GameType): void {
    this._gameType$.next(gameType);
  }

  public setIsTurnBased(isTurnBased: boolean): void {
    const currentGet = this.getGameTurnSettings();
    if (!currentGet) return;
    this._isTurnBased$.next({...currentGet, isTurnBased});
  }

  public setShowTurnNumber(showTurnNumber: boolean): void {
    const currentGet = this.getGameTurnSettings();
    if (!currentGet) return;
    this._isTurnBased$.next({...currentGet, showTurnNumber});
  }

  public setTurnNumberOffset(turnNumberOffset: number): void {
    const currentGet = this.getGameTurnSettings();
    if (!currentGet) return;
    this._isTurnBased$.next({...currentGet, turnNumberOffset});
  }

  public editPlayers(): void {
    const currentGame = this.gamesService.currentGame$.value;
    if (!currentGame) {
      console.error('editPlayers but no current game');
      return;
    }
    const recentPlayers = this.gamesService.getRegisteredPlayers();
    this.dialog.open<NewGameDialogComponent, NewGameDialogData, NewGameDialogResult>(
      NewGameDialogComponent,
      {
        data: {
          recentPlayers,
          fromGame: currentGame,
        },
        autoFocus: 'first-header',
        closeOnNavigation: false,
      },
    )
      .afterClosed()
      .pipe(
        filter(res => !!res),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(res => {
        if (res.game.lowerScoreWins !== currentGame.lowerScoreWins) {
          this.setLowerScoreWins(res.game.lowerScoreWins);
        }
        if (res.game.gameType !== currentGame.gameType) {
          this.setGameType(res.game.gameType);
        }
        if (res.playerEdition.map(p => p.playerName).join(',') !== currentGame.players.map(p => p.name).join(',')) {
          this._playerEdition$.next(res.playerEdition);
        }
      });
  }

  private getGameTurnSettings(): IGameEditTurn | null {
    const currentGame = this.gamesService.currentGame$.value;
    if (!currentGame) {
      console.error('getGameTurnSettings but no current game');
      return null;
    }
    return {
      gameId: currentGame.gameId,
      isTurnBased: currentGame.isTurnBased,
      showTurnNumber: currentGame.showTurnNumber,
      turnNumberOffset: currentGame.turnNumberOffset,
    };
  }
}
