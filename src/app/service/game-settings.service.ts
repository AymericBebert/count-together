import {Injectable} from '@angular/core';
import {GamesService} from './games.service';
import {delay, map} from 'rxjs/operators';
import {GameType, IGameSettings} from '../model/game';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class GameSettingsService {

  public gameSettings$: Observable<IGameSettings | null> = this.gamesService.currentGame$.pipe(
    delay(0),
    map(g => g ? {lowerScoreWins: g.lowerScoreWins, gameType: g.gameType} : null),
  );

  private lowerScoreWins$$ = new Subject<boolean>();
  private gameType$$ = new Subject<GameType>();

  public lowerScoreWins$ = this.lowerScoreWins$$.asObservable();
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
