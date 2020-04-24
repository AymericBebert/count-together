import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, EMPTY, Observable, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, map, skip, switchMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {ApiErrorService} from '../api-error/api-error.service';
import {Game, StoredGame} from '../model/game';
import {gamesBackendRoutes} from '../games-backend.routes';
import {StorageService} from '../storage/storage.service';
import {SocketService} from '../socket/socket.service';

@Injectable()
export class GamesService {

  public currentGame$ = new BehaviorSubject<Game | null>(null);
  private currentGameId$ = this.currentGame$.pipe(map(game => game?.gameId || ''), distinctUntilChanged());

  private gameLeft$ = this.currentGame$.pipe(skip(1), filter(g => !g), map<null, void>(() => void 0));

  private registerGameChange$ = new Subject<void>();
  private registerGame$ = this.registerGameChange$.pipe(withLatestFrom(this.currentGame$), map(([, game]) => game));

  constructor(private http: HttpClient,
              private apiError: ApiErrorService,
              private socket: SocketService,
              private storageService: StorageService,
  ) {
    this.currentGame$
      .pipe(
        filter(game => game && game.gameId === 'offline'),
        distinctUntilChanged((g, h) => g.gameId === h.gameId),
      )
      .subscribe(() => this.loadOfflineGameFromStorage());

    this.registerGame$
      .pipe(filter(game => game && game.gameId === 'offline'), debounceTime(500))
      .subscribe(game => this.saveOfflineGameToStorage(game));

    this.currentGame$
      .pipe(filter(game => game && game.gameId !== 'offline'), debounceTime(3000))
      .subscribe(game => this.addToVisitedGames(game));

    this.registerGame$
      .pipe(
        filter(game => game && game.gameId !== 'offline'),
        distinctUntilChanged((g, h) => JSON.stringify(g) === JSON.stringify(h)),
        debounceTime(200),
      )
      .subscribe(game => this.socket.emit('game update', game));

    combineLatest([
      this.currentGameId$,
      this.socket.connected$,
    ])
      .pipe(filter(([gid, c]) => c && gid && gid !== 'offline'))
      .subscribe(([gameId]) => {
        this.socket.emit('game exit');
        this.socket.emit('game join', gameId);
      });

    this.socket.connected$
      .pipe(
        filter(c => c),
        switchMap(() => this.socket.on('game')),
        takeUntil(this.gameLeft$),
      )
      .subscribe(g => {
        console.log('Received game update');
        this.currentGame$.next(g);
      });

    this.gameLeft$.subscribe(() => console.log('game left'));
  }

  public editGame(game: Game) {
    this.currentGame$.next(game);
    this.registerGameChange$.next();
  }

  public setCurrentGameId(gameId: string | null) {
    const currentGame = this.currentGame$.getValue();
    if (!gameId) {
      this.socket.disconnectSocket();
    }
    if (currentGame && currentGame.gameId !== gameId) {
      this.currentGame$.next(null);
    }
    if (gameId && (!currentGame || currentGame.gameId !== gameId)) {
      if (gameId === 'offline') {
        this.loadOfflineGameFromStorage();
      } else {
        this.getGame(gameId).subscribe(game => this.currentGame$.next(game));
        this.socket.connectSocket();
      }
    }
  }

  public postNewGame(game: Game): Observable<Game | null> {
    return this.http.post<{ result: Game | null; error: string; }>(gamesBackendRoutes.postNewGame(), game).pipe(
      tap(res => res.error && this.apiError.displayError(`postNewGame: ${res.error}`)),
      catchError(error => {
        console.error('postNewGame', error);
        this.apiError.displayError(`Could not post new game`);
        return EMPTY;
      }),
      map(res => res.result),
    );
  }

  public getVisitedGames(): StoredGame[] {
    const visitedGamesFromStorage = this.storageService.getItem('visitedGames') || '[]';
    return JSON.parse(visitedGamesFromStorage).map(g => ({...g, date: new Date(g.date)}));
  }

  public deleteVisitedGame(gameId: string): StoredGame[] {
    const newStoredGames = this.getVisitedGames().filter(sg => sg.gameId !== gameId);
    this.storageService.setItem('visitedGames', JSON.stringify(newStoredGames));
    return newStoredGames;
  }

  private getGame(gameId: string): Observable<Game | null> {
    return this.http.get<{ result: Game | null; error: string }>(gamesBackendRoutes.getGame(gameId)).pipe(
      tap(res => res.error && this.apiError.displayError(`getGame: ${res.error}`)),
      map(res => res.result),
    );
  }

  private loadOfflineGameFromStorage() {
    const gameFromStorage = this.storageService.getItem('offlineGame');
    if (gameFromStorage) {
      try {
        console.log('Loading game from storage');
        this.currentGame$.next(JSON.parse(gameFromStorage));
      } catch (err) {
        console.error('Could not parse game from storage:', err);
        console.error('Storage value:', gameFromStorage);
      }
    } else {
      this.currentGame$.next({
        gameId: 'offline',
        name: 'New Game',
        players: [{name: '<P1>', scores: []}],
        lowerScoreWins: false,
      });
    }
  }

  private saveOfflineGameToStorage(game: Game) {
    console.log('Saving game to storage');
    this.storageService.setItem('offlineGame', JSON.stringify(game));
  }

  private addToVisitedGames(game: Game) {
    const visitedGamesFromStorage = this.storageService.getItem('visitedGames') || '[]';
    const visitedGames: StoredGame[] = JSON.parse(visitedGamesFromStorage);
    const foundAtIndex = visitedGames.map(sg => sg.gameId).indexOf(game.gameId);
    if (foundAtIndex >= 0) {
      visitedGames[foundAtIndex] = {gameId: game.gameId, name: game.name, date: new Date()};
    } else {
      visitedGames.push({gameId: game.gameId, name: game.name, date: new Date()});
    }
    this.storageService.setItem('visitedGames', JSON.stringify(visitedGames));
  }

  // public gamesList$ = new BehaviorSubject<Game[]>([]);

  // private getAllGames(): void {
  //   this.http.get<{ result: Game[]; error: string }>(gamesBackendRoutes.getAllGames()).pipe(
  //     tap(res => res.error && this.apiError.displayError(`getAllGames: ${res.error}`)),
  //     map(res => res.result),
  //   ).subscribe(games => this.gamesList$.next(games));
  // }

  // private putGame(game: Game): void {
  //   this.http.put<{ result: Game | null; error: string }>(gamesBackendRoutes.putGame(game.gameId), game).pipe(
  //     tap(res => res.error && this.apiError.displayError(`getAllGames: ${res.error}`)),
  //     map(res => res.result),
  //   ).subscribe(updatedGame => this.currentGame$.next(updatedGame));
  // }

  // private deleteGame(gameId: string): Observable<boolean> {
  //   return this.http.delete<{ error: string; }>(gamesBackendRoutes.deleteGame(gameId)).pipe(
  //     tap(res => res.error && this.apiError.displayError(`deleteGame: ${res.error}`)),
  //     map(res => !!res.error),
  //   );
  // }
}
