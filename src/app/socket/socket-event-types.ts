import {Game} from '../model/game';

export interface ReceivedEventTypes {
  'disconnect': void;
  'game joined': string;
  'game exited': string;
  'game': Game;
  'game deleted': string;
}

export interface EmittedEventTypes {
  'game join': string;
  'game exit': void;
  'game update': Game;
  'game delete': string;
}
