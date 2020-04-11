import {Player} from './player';

export interface Game {
  gameId: string;
  name: string;
  lowerScoreWins: boolean;
  players: Player[];
}
