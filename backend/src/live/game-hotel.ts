import type {Server, Socket} from 'socket.io';
import {emitEvent} from '../events.ts';
import {GamesService} from '../games/games.service.ts';
import type {Game} from '../model/game.ts';
import {GameRoom} from './game-room.ts';

export class GameHotel {
  private rooms: { [gameId: string]: GameRoom } = {};

  constructor(private readonly io: Server) {
  }

  public async addConnection(socket: Socket, gameId: string): Promise<boolean> {
    if (!this.rooms[gameId]) {
      const game = await GamesService.getGameById(gameId).catch(err => console.error('addConnection err:', err));
      if (!game) {
        console.warn(`addConnection to ${gameId} failed: game does not exist`);
        return false;
      }
      this.rooms[gameId] = new GameRoom(this.io, game);
    }
    const connected = this.rooms[gameId].addConnection(socket);
    if (connected) {
      emitEvent(socket, 'game', this.rooms[gameId].game);
    }
    const numConnected = await this.rooms[gameId].getConnectionCount();
    console.log(`Room ${this.rooms[gameId].room}: client joined (${numConnected} connected) ${socket.id}`);
    return connected;
  }

  public async removeConnection(socket: Socket, gameId: string): Promise<boolean> {
    if (!this.rooms[gameId]) {
      return false;
    }
    const removed = this.rooms[gameId].removeConnection(socket);
    const numConnected = await this.rooms[gameId].getConnectionCount();
    console.log(`Room ${this.rooms[gameId].room}: client left (${numConnected} connected) ${socket.id}`);
    if (numConnected === 0) {
      this.rooms[gameId].destroy();
      delete this.rooms[gameId];
      console.log(`Cleaned up room of game ${gameId}`);
    }
    return removed;
  }

  public sendGame(socket: Socket, gameId: string): boolean {
    if (!this.rooms[gameId]) {
      return false;
    }
    return socket.emit('game', this.rooms[gameId]);
  }

  public updateGame(game: Game): void {
    if (!this.rooms[game.gameId]) {
      return;
    }
    this.rooms[game.gameId].game = game;
    this.rooms[game.gameId].emit('game', game);
  }

  public deleteGame(gameId: string): void {
    if (!this.rooms[gameId]) {
      return;
    }
    this.rooms[gameId].emit('game deleted', gameId);
    this.rooms[gameId].destroy();
    delete this.rooms[gameId];
  }
}
