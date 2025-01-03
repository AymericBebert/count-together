import {
  IGame,
  IGameEditGameType,
  IGameEditName,
  IGameEditPlayer,
  IGameEditPlayers,
  IGameEditScore,
  IGameEditWin,
  IGameRemovePlayer,
  IGameRemoveScore
} from '../model/game';

/* eslint-disable @typescript-eslint/naming-convention */

export interface ReceivedEventTypes {
  'connect': void;
  'disconnect': void;
  'display error': string;
  'game joined': string;
  'game exited': string;
  'game': IGame;
  'game deleted': string;
}

export interface EmittedEventTypes {
  'game join': string;
  'game exit': void;
  'game update': IGame;
  'game delete': string;
  'game edit name': IGameEditName;
  'game edit win': IGameEditWin;
  'game edit type': IGameEditGameType;
  'game edit player': IGameEditPlayer;
  'game edit players': IGameEditPlayers;
  'game remove player': IGameRemovePlayer;
  'game edit score': IGameEditScore;
  'game remove score': IGameRemoveScore;
}
