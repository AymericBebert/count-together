import {environment} from '../environments/environment';

const baseUrl = environment.backendUrl;

export const gamesBackendRoutes = {
  postNewGame: () => `${baseUrl}/games/new-game`,
  getGame: (gameId: string) => `${baseUrl}/games/game/${gameId}`,
  getAllGames: () => `${baseUrl}/games/games`,
  putGame: (gameId: string) => `${baseUrl}/games/game/${gameId}`,
  deleteGame: (gameId: string) => `${baseUrl}/games/game/${gameId}`,
};
