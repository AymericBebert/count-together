import {inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {GameType, IGameSettings} from '../model/game';
import {GamesService} from './games.service';

@Injectable({
  providedIn: 'root',
})
export class GameSettingsService {
  private readonly gamesService = inject(GamesService);

  public gameSettings$: Observable<IGameSettings | null> = this.gamesService.currentGame$.pipe(
    delay(0),
    map(g => g ? {lowerScoreWins: g.lowerScoreWins, gameType: g.gameType} : null),
  );

  private _lowerScoreWins$ = new Subject<boolean>();
  public lowerScoreWins$ = this._lowerScoreWins$.asObservable();

  private _gameType$ = new Subject<GameType>();
  public gameType$ = this._gameType$.asObservable();

  public setLowerScoreWins(lowerScoreWins: boolean) {
    this._lowerScoreWins$.next(lowerScoreWins);
  }

  public setGameType(gameType: GameType) {
    this._gameType$.next(gameType);
  }
}
