import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, skip, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {ApiErrorService} from '../api-error/api-error.service';
import {Game} from '../model/game';
import {gamesBackendRoutes} from '../games-backend.routes';
import {StorageService} from './storage.service';
import {SocketService} from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  public currentGame$ = new BehaviorSubject<Game | null>(null);
  private gameLeft$ = this.currentGame$.pipe(skip(1), filter(g => !g), map<null, void>(() => void 0));

  private registerGameChange$ = new Subject<void>();
  private registerGame$ = this.registerGameChange$.pipe(withLatestFrom(this.currentGame$), map(([, game]) => game));

  // public gamesList$ = new BehaviorSubject<Game[]>([]);

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

    this.registerGame$
      .pipe(
        filter(game => game && game.gameId !== 'offline'),
        distinctUntilChanged((g, h) => JSON.stringify(g) === JSON.stringify(h)),
        debounceTime(200),
      )
      .subscribe(game => this.socket.emit('game update', game));

    this.gameLeft$.subscribe(() => console.log('game left'));
  }

  public editGame(game: Game) {
    this.currentGame$.next(game);
    this.registerGameChange$.next();
  }

  public loadOfflineGameFromStorage() {
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
      this.currentGame$.next({gameId: 'offline', name: 'New Game', players: [], lowerScoreWins: false});
    }
  }

  public saveOfflineGameToStorage(game: Game) {
    console.log('Saving game to storage');
    this.storageService.setItem('offlineGame', JSON.stringify(game));
  }

  public setCurrentGameId(gameId: string | null) {
    const currentGame = this.currentGame$.getValue();
    if (currentGame && !gameId) {
      this.disconnectGame();
    }
    if (currentGame && currentGame.gameId !== gameId) {
      this.currentGame$.next(null);
    }
    if (gameId && (!currentGame || currentGame.gameId !== gameId)) {
      if (gameId === 'offline') {
        this.loadOfflineGameFromStorage();
      } else {
        this.getGame(gameId).subscribe(game => this.currentGame$.next(game));
        this.connectGame(gameId);
      }
    }
  }

  public connectGame(gameId: string) {
    this.socket.connectSocket();

    this.socket.connected$
      .pipe(filter(c => c), takeUntil(this.gameLeft$))
      .subscribe(() => this.socket.emit('game join', gameId));

    this.socket.on('game')
      .pipe(takeUntil(this.gameLeft$))
      .subscribe(g => {
        console.log('Received game update');
        this.currentGame$.next(g);
      });
  }

  public disconnectGame() {
    this.socket.emit('game exit');
    this.socket.disconnectSocket();
  }

  public postNewGame(game: Game): Observable<Game | null> {
    return this.http.post<{ result: Game | null; error: string; }>(gamesBackendRoutes.postNewGame(), game).pipe(
      tap(res => res.error && this.apiError.displayError(`postNewGame: ${res.error}`)),
      map(res => res.result),
    );
  }

  public getGame(gameId: string): Observable<Game | null> {
    return this.http.get<{ result: Game | null; error: string }>(gamesBackendRoutes.getGame(gameId)).pipe(
      tap(res => res.error && this.apiError.displayError(`getGame: ${res.error}`)),
      map(res => res.result),
    );
  }

  // public getAllGames(): void {
  //   this.http.get<{ result: Game[]; error: string }>(gamesBackendRoutes.getAllGames()).pipe(
  //     tap(res => res.error && this.apiError.displayError(`getAllGames: ${res.error}`)),
  //     map(res => res.result),
  //   ).subscribe(games => this.gamesList$.next(games));
  // }

  // public putGame(game: Game): void {
  //   this.http.put<{ result: Game | null; error: string }>(gamesBackendRoutes.putGame(game.gameId), game).pipe(
  //     tap(res => res.error && this.apiError.displayError(`getAllGames: ${res.error}`)),
  //     map(res => res.result),
  //   ).subscribe(updatedGame => this.currentGame$.next(updatedGame));
  // }

  // public deleteGame(gameId: string): Observable<boolean> {
  //   return this.http.delete<{ error: string; }>(gamesBackendRoutes.deleteGame(gameId)).pipe(
  //     tap(res => res.error && this.apiError.displayError(`deleteGame: ${res.error}`)),
  //     map(res => !!res.error),
  //   );
  // }
}