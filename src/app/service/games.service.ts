import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, finalize, map, skip, switchMap, takeUntil, tap} from 'rxjs/operators';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {ApiErrorService} from '../api-error/api-error.service';
import {GameType, IGame, IKnownPlayers, IRecentPlayer, IStoredGame} from '../model/game';
import {SocketService} from '../socket/socket.service';
import {StorageService} from '../storage/storage.service';

@Injectable()
export class GamesService {

  public gameCheckPending$ = new BehaviorSubject<boolean>(false);
  public gameCheck$ = new Subject<IGame | null>();

  public currentGame$ = new BehaviorSubject<IGame | null>(null);
  private currentGameId$ = this.currentGame$.pipe(map(game => game?.gameId || ''), distinctUntilChanged());

  private gameLeft$ = this.currentGame$.pipe(skip(1), filter(g => !g), map<null, void>(() => void 0));

  constructor(private http: HttpClient,
              private apiError: ApiErrorService,
              private socket: SocketService,
              private storageService: StorageService,
              @Inject(APP_CONFIG) private config: AppConfig,
  ) {
    this.currentGame$
      .pipe(
        filter(game => game && game.gameId === 'offline'),
        distinctUntilChanged((g, h) => g.gameId === h.gameId),
      )
      .subscribe(() => this.loadOfflineGameFromStorage());

    this.currentGame$
      .pipe(
        filter(game => game && game.gameId === 'offline'),
        debounceTime(500),
      )
      .subscribe(game => this.saveOfflineGameToStorage(game));

    this.currentGame$
      .pipe(
        filter(game => game && game.gameId !== 'offline'),
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
      .pipe(filter(([gid, c]) => c && gid && gid !== 'offline'))
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

  public updateSavedGame(game: IGame) {
    if (game.gameId === 'offline') {
      this.currentGame$.next(game);
    }
  }

  public gameEditName(gameId: string, name: string) {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit name', {gameId, name});
  }

  public gameEditWin(gameId: string, lowerScoreWins: boolean) {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit win', {gameId, lowerScoreWins});
  }

  public gameEditGameType(gameId: string, gameType: GameType) {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit type', {gameId, gameType});
  }

  public gameEditPlayer(gameId: string, playerId: number, playerName: string) {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit player', {gameId, playerId, playerName});
  }

  public gameRemovePlayer(gameId: string, playerId: number) {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game remove player', {gameId, playerId});
  }

  public gameEditScore(gameId: string, playerId: number, scoreId: number, score: number) {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game edit score', {gameId, playerId, scoreId, score});
  }

  public gameRemoveScore(gameId: string, playerId: number, scoreId: number) {
    if (gameId === 'offline') {
      return;
    }
    this.socket.emit('game remove score', {gameId, playerId, scoreId});
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

  public gameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value.length < this.config.tokenLength) {
        return of(null);
      }
      return this.gameExistsCheck(control.value).pipe(
        map(res => res ? null : {gameNotFound: true}),
      );
    };
  }

  public postNewGame(game: IGame): Observable<IGame | null> {
    return this.http.post<{ result: IGame | null; error: string; }>(`${this.config.backendUrl}/games/new-game`, game).pipe(
      tap(res => res.error && this.apiError.displayError(`postNewGame: ${res.error}`)),
      catchError(error => {
        console.error('postNewGame', error);
        this.apiError.displayError(`Could not post new game`);
        return EMPTY;
      }),
      map(res => res.result),
    );
  }

  public duplicateGame(gameId: string): Observable<IGame | null> {
    return this.http.post<{ result: IGame | null; error: string; }>(`${this.config.backendUrl}/games/duplicate/${gameId}`, null).pipe(
      tap(res => res.error && this.apiError.displayError(`duplicateGame: ${res.error}`)),
      catchError(error => {
        console.error('duplicateGame', error);
        this.apiError.displayError(`Could not duplicate game`);
        return EMPTY;
      }),
      map(res => res.result),
    );
  }

  public getVisitedGames(): IStoredGame[] {
    const visitedGamesFromStorage = this.storageService.getItem('visitedGames') || '[]';
    return JSON.parse(visitedGamesFromStorage).map(g => ({...g, date: new Date(g.date)}));
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

  public forgetPlayer(playerName: string) {
    const knownPlayersFromStorage = this.storageService.getItem('knownPlayers') || '{}';
    const knownPlayers: IKnownPlayers = JSON.parse(knownPlayersFromStorage);
    delete knownPlayers[playerName];
    this.storageService.setItem('knownPlayers', JSON.stringify(knownPlayers));
  }

  private gameExistsCheck(token: string): Observable<IGame | null> {
    this.gameCheckPending$.next(true);
    return this.getGame(token).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      }),
      tap(game => this.gameCheck$.next(game)),
      finalize(() => this.gameCheckPending$.next(false)),
    );
  }

  private getGame(gameId: string): Observable<IGame | null> {
    return this.http.get<{ result: IGame | null; error: string }>(`${this.config.backendUrl}/games/game/${gameId}`).pipe(
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
        players: [{name: 'P1', scores: []}],
        gameType: 'free',
        lowerScoreWins: false,
      });
    }
  }

  private saveOfflineGameToStorage(game: IGame) {
    console.log('Saving game to storage');
    this.storageService.setItem('offlineGame', JSON.stringify(game));
  }

  private addToVisitedGames(gameId: string, name: string) {
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
