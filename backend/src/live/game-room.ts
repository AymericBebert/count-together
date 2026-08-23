import {Subject} from 'rxjs';
import type {Server, Socket} from 'socket.io';
import {config} from '../config.ts';
import type {EmittedEventTypes} from '../events.ts';
import type {Game} from '../model/game.ts';

export class GameRoom {
  public destroy$: Subject<void> = new Subject<void>();
  private readonly gameId: string;

  constructor(private readonly io: Server,
              private _game: Game) {
    this.gameId = _game.gameId;
  }

  public get game(): Game {
    return this._game;
  }

  public set game(game: Game) {
    if (game.gameId === this.gameId) {
      this._game = game;
    } else {
      console.error(`Error: trying to update room ${this.gameId} with game ${game.gameId}`);
    }
  }

  public get room(): string {
    return this.gameId;
  }

  public addConnection(socket: Socket): boolean {
    try {
      void socket.join(this.room);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  public removeConnection(socket: Socket): boolean {
    try {
      void socket.leave(this.room);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  public getConnectionCount(): Promise<number> {
    return this.io.sockets.adapter.sockets(new Set([this.room])).then(s => s.size);
  }

  public destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public emit<T extends keyof EmittedEventTypes>(eventName: T, ...args: Array<EmittedEventTypes[T]>): void {
    if (config.debugSocket) {
      console.log(`socket< [${this.room}] ${eventName}: ${JSON.stringify(args[0])?.substr(0, 999)}`);
    } else {
      console.log(`Emitting event to clients of ${this.room}: ${eventName}`);
    }
    this.io.to(this.room).emit(eventName, ...args);
  }
}
