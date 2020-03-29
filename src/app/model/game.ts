import {Player} from './player';

export interface Game {
  id: string;
  name: string;
  lowerScoreWins: boolean;
  players: Player[];
}
