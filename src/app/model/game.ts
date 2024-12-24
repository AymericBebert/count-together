import {Player} from './player';

export type GameType = 'free' | 'smallScores' | 'winOrLose';

export interface IGame {
  gameId: string;
  name: string;
  gameType: GameType;
  lowerScoreWins: boolean;
  players: Player[];
}

export interface IGameSettings {
  gameType: GameType;
  lowerScoreWins: boolean;
}

export interface IStoredGame {
  gameId: string;
  name: string;
  date: Date;
}

export interface IRecentPlayer {
  name: string;
  wasLatest: boolean;
}

/** Record of player names and the timestamp of their last game */
export type IKnownPlayers = Record<string, number>;

export interface IGameEditName {
  gameId: string;
  name: string;
}

export interface IGameEditWin {
  gameId: string;
  lowerScoreWins: boolean;
}

export interface IGameEditGameType {
  gameId: string;
  gameType: GameType;
}

export interface IGameEditPlayer {
  gameId: string;
  playerId: number;
  playerName: string;
}

export interface PlayerEdition {
  oldPlayerId: number;
  playerName: string;
}

export interface IGameEditPlayers {
  gameId: string;
  players: PlayerEdition[];
}

export interface IGameRemovePlayer {
  gameId: string;
  playerId: number;
}

export interface IGameEditScore {
  gameId: string;
  playerId: number;
  scoreId: number;
  score: number | null;
}

export interface IGameRemoveScore {
  gameId: string;
  playerId: number;
  scoreId: number;
}
