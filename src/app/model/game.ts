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

export type IKnownPlayers = { [name: string]: number };

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

export interface IGameRemovePlayer {
  gameId: string;
  playerId: number;
}

export interface IGameEditScore {
  gameId: string;
  playerId: number;
  scoreId: number;
  score: number;
}

export interface IGameRemoveScore {
  gameId: string;
  playerId: number;
  scoreId: number;
}
