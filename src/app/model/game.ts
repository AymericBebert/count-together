import {Player} from './player';

export interface Game {
  gameId: string;
  name: string;
  lowerScoreWins: boolean;
  players: Player[];
}

export interface StoredGame {
  gameId: string;
  name: string;
  date: Date;
}
