import mongoose, {type HydratedDocument} from 'mongoose';
import type {GameType} from './game-type.ts';
import {pickPlayer, type Player, type PlayerDocument, playerSchema} from './player.ts';

export interface Game {
  gameId: string;
  name: string;
  gameType: GameType;
  lowerScoreWins: boolean;
  isTurnBased: boolean;
  showTurnNumber: boolean;
  turnNumberOffset: number;
  players: Player[];
  duplicatedTo?: string;
  duplicatedAt?: number;
}

export interface StoredGame extends Omit<Game, 'players'> {
  players: PlayerDocument[];
}

export const gameSchema = new mongoose.Schema<StoredGame>({
  gameId: {type: String, required: true, unique: true, index: true},
  name: String,
  gameType: String,
  lowerScoreWins: Boolean,
  isTurnBased: Boolean,
  showTurnNumber: Boolean,
  turnNumberOffset: Number,
  players: [playerSchema],
  duplicatedTo: String,
  duplicatedAt: Number,
});

export const GameM = mongoose.model<StoredGame>('Game', gameSchema);

export type GameDocument = HydratedDocument<StoredGame>

export const pickGame = (game: Game): Game => ({
  gameId: game.gameId,
  name: game.name,
  gameType: game.gameType,
  lowerScoreWins: game.lowerScoreWins,
  isTurnBased: game.isTurnBased,
  showTurnNumber: game.showTurnNumber,
  turnNumberOffset: game.turnNumberOffset,
  players: [...game.players.map(p => pickPlayer(p))],
  duplicatedTo: game.duplicatedTo,
  duplicatedAt: game.duplicatedAt,
});
