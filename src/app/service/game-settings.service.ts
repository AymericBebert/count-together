import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {GameType, IGameSettings} from '../model/game';
import {GamesService} from './games.service';

@Injectable()
export class GameSettingsService {

  public gameSettings$: Observable<IGameSettings | null> = this.gamesService.currentGame$.pipe(
    delay(0),
    map(g => g ? {lowerScoreWins: g.lowerScoreWins, gameType: g.gameType} : null),
  );

  private lowerScoreWins$$ = new Subject<boolean>();
  public lowerScoreWins$ = this.lowerScoreWins$$.asObservable();

  private gameType$$ = new Subject<GameType>();
  public gameType$ = this.gameType$$.asObservable();

  constructor(private gamesService: GamesService,
  ) {
  }

  public setLowerScoreWins(lowerScoreWins: boolean) {
    this.lowerScoreWins$$.next(lowerScoreWins);
  }

  public setGameType(gameType: GameType) {
    this.gameType$$.next(gameType);
  }
}
