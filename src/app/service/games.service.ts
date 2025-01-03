import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  skip,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {ApiErrorService} from '../api-error/api-error.service';
import {GameType, IGame, IKnownPlayers, IRecentPlayer, IStoredGame, PlayerEdition} from '../model/game';
import {SocketService} from '../socket/socket.service';
import {StorageService} from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private readonly http = inject(HttpClient);
  private readonly apiError = inject(ApiErrorService);
  private readonly socket = inject(SocketService);
  private readonly storageService = inject(StorageService);
  private readonly config = inject<AppConfig>(APP_CONFIG);

  public readonly gameCheckPending = signal<boolean>(false);
  public readonly gameCheck$ = new Subject<IGame | null>();

  public readonly currentGame$ = new BehaviorSubject<IGame | null>(null);
  private readonly currentGameId$ = this.currentGame$.pipe(map(game => game?.gameId || ''), distinctUntilChanged());

  private readonly gameLeft$ = this.currentGame$.pipe(
    skip(1),
    filter((g): g is null => !g),
    map<null, void>(() => void 0),
  );

  constructor() {
    this.currentGame$
      .pipe(
        filter((game): game is IGame => !!game && game.gameId === 'offline'),
        distinctUntilChanged((g, h) => g.gameId === h.gameId),
      )
      .subscribe(() => this.loadOfflineGameFromStorage());

    this.currentGame$
      .pipe(
        filter((game): game is IGame => !!game && game.gameId === 'offline'),
        debounceTime(500),
      )
      .subscribe(game => this.saveOfflineGameToStorage(game));

    this.currentGame$
      .pipe(
        filter((game): game is IGame => !!game && game.gameId !== 'offline'),
        map(game => ({gameId: game.gameId, name: game.name, playerNames: game.players.map(p => p.name)})),
        debounceTime(500),
      )
      .subscribe(({gameId, name, playerNames}) => {
        this.addToVisitedGames(gameId, name);
        this.registerPlayers(playerNames);
      });

    combineLatest([
      this.currentGameId$,
      this.socket.connected$,
    ])
      .pipe(filter(([gameId, c]) => c && !!gameId && gameId !== 'offline'))
      .subscribe(([gameId]) => {
        this.socket.emit('game exit');
        this.socket.emit('game join', gameId);
      });

    this.socket.connected$
      .pipe(
        filter(c => c),
        switchMap(() => this.socket.on('display error').pipe(takeUntil(this.gameLeft$))),
      )
      .subscribe(err => {
        this.apiError.displayError(err);
      });

    this.socket.connected$
      .pipe(
        filter(c => c),
        switchMap(() => this.socket.on('game').pipe(takeUntil(this.gameLeft$))),
      )
      .subscribe(g => {
        console.log('Received game update');
        this.currentGame$.next(g);
      });

    this.gameLeft$.subscribe(() => console.log('game left'));
  }

  public updateSavedGame(game: IGame): void {
    if (game.gameId === 'offline') {
      this.currentGame$.next(game);
    }
  }

  public saveOfflineGameToStorage(game: IGame): void {
    console.log('Saving game to storage');
    this.storageService.setItem('offlineGame', JSON.stringify(game));
  }

  public gameEditName(gameId: string, name: string): void {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit name', {gameId, name});
  }

  public gameEditWin(gameId: string, lowerScoreWins: boolean): void {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit win', {gameId, lowerScoreWins});
  }

  public gameEditGameType(gameId: string, gameType: GameType): void {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit type', {gameId, gameType});
  }

  public gameEditPlayer(gameId: string, playerId: number, playerName: string): void {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit player', {gameId, playerId, playerName});
  }

  public gameEditPlayers(gameId: string, players: PlayerEdition[]): void {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit players', {gameId, players});
  }

  public gameRemovePlayer(gameId: string, playerId: number): void {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game remove player', {gameId, playerId});
  }

  public gameEditScore(gameId: string, playerId: number, scoreId: number, score: number | null): void {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit score', {gameId, playerId, scoreId, score});
  }

  public gameRemoveScore(gameId: string, playerId: number, scoreId: number): void {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game remove score', {gameId, playerId, scoreId});
  }

  public setCurrentGameId(gameId: string | null): void {
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
        this.getGameNotFoundOk$(gameId).subscribe(game => this.currentGame$.next(game));
        this.socket.connectSocket();
      }
    }
  }

  public gameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value.length < this.config.tokenLength) {
        return of(null);
      }
      return this.gameExistsCheck$(control.value).pipe(
        map(res => res ? null : {gameNotFound: true}),
      );
    };
  }

  public postNewGame$(game: IGame): Observable<IGame> {
    return this.http.post<IGame>(`${this.config.backendUrl}/games/new-game`, game).pipe(
      catchError(error => {
        this.apiError.displayError('Could not post new game', error);
        return EMPTY;
      }),
    );
  }

  public duplicateGame$(gameId: string): Observable<IGame> {
    return this.http.post<IGame>(`${this.config.backendUrl}/games/duplicate/${gameId}`, null).pipe(
      catchError(error => {
        this.apiError.displayError('Could not duplicate game', error);
        return EMPTY;
      }),
    );
  }

  public getVisitedGames(): IStoredGame[] {
    const visitedGamesFromStorage = this.storageService.getItem('visitedGames') || '[]';
    return JSON.parse(visitedGamesFromStorage).map((g: IStoredGame) => ({...g, date: new Date(g.date)}));
  }

  public deleteVisitedGame(gameId: string): IStoredGame[] {
    const newStoredGames = this.getVisitedGames().filter(sg => sg.gameId !== gameId);
    this.storageService.setItem('visitedGames', JSON.stringify(newStoredGames));
    return newStoredGames;
  }

  public getRegisteredPlayers(): IRecentPlayer[] {
    const latestPlayersFromStorage = this.storageService.getItem('latestPlayers') || '[]';
    const latestPlayers: string[] = JSON.parse(latestPlayersFromStorage);

    const knownPlayersFromStorage = this.storageService.getItem('knownPlayers') || '{}';
    const knownPlayers: IKnownPlayers = JSON.parse(knownPlayersFromStorage);

    latestPlayers.forEach(playerName => delete knownPlayers[playerName]);

    return [
      ...latestPlayers.map(name => ({name, wasLatest: true})),
      ...Object.entries(knownPlayers)
        .sort((e1, e2) => e2[1] - e1[1])
        .map(e => ({name: e[0], wasLatest: false})),
    ];
  }

  public forgetPlayer(playerName: string): void {
    const knownPlayersFromStorage = this.storageService.getItem('knownPlayers') || '{}';
    const knownPlayers: IKnownPlayers = JSON.parse(knownPlayersFromStorage);
    delete knownPlayers[playerName];
    this.storageService.setItem('knownPlayers', JSON.stringify(knownPlayers));
  }

  private gameExistsCheck$(token: string): Observable<IGame | null> {
    this.gameCheckPending.set(true);
    return this.getGameNotFoundOk$(token).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      }),
      tap(game => this.gameCheck$.next(game)),
      finalize(() => this.gameCheckPending.set(false)),
    );
  }

  private getGameNotFoundOk$(gameId: string): Observable<IGame | null> {
    return this.http.get<IGame>(`${this.config.backendUrl}/games/game/${gameId}?notFoundOk=true`);
  }

  private loadOfflineGameFromStorage(): void {
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
        players: [{name: 'P1', scores: []}],
        gameType: 'free',
        lowerScoreWins: false,
      });
    }
  }

  private addToVisitedGames(gameId: string, name: string): void {
    const visitedGamesFromStorage = this.storageService.getItem('visitedGames') || '[]';
    const visitedGames: IStoredGame[] = JSON.parse(visitedGamesFromStorage);
    const foundAtIndex = visitedGames.map(sg => sg.gameId).indexOf(gameId);
    if (foundAtIndex >= 0) {
      visitedGames[foundAtIndex] = {gameId, name, date: new Date()};
    } else {
      visitedGames.push({gameId, name, date: new Date()});
    }
    this.storageService.setItem('visitedGames', JSON.stringify(visitedGames));
  }

  private registerPlayers(playerNames: string[]): void {
    this.storageService.setItem('latestPlayers', JSON.stringify(playerNames));

    const knownPlayersFromStorage = this.storageService.getItem('knownPlayers') || '{}';
    const knownPlayers: IKnownPlayers = JSON.parse(knownPlayersFromStorage);

    const now = Date.now();
    playerNames.forEach(playerName => knownPlayers[playerName] = now);
    this.storageService.setItem('knownPlayers', JSON.stringify(knownPlayers));
  }
}
