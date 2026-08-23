import cors from 'cors';
import express from 'express';
import {createServer, type Server as HttpServer} from 'http';
import {Server, type Socket} from 'socket.io';
import {config} from './config.ts';
import {customErrorHandler} from './error/custom-error-handler.ts';
import {HttpError} from './error/http-error.ts';
import gamesRouter from './games/games.router.ts';
import {GameHotel} from './live/game-hotel.ts';
import {HotelProvider} from './live/hotel-provider.ts';
import {loggerMiddleware} from './middlewares/logger.ts';
import {onConnection} from './socket/on-connection.ts';
import {connectMongooseWithRetry} from './utils/mongodb-connect.ts';

// Since node 15, process exits when a promise is not handled. This is very dangerous.
process.on('unhandledRejection', (reason) => {
  console.error('!> UnhandledRejection:', reason);
});

// Readiness items
const ready: Record<string, boolean> = {
  mongo: false,
};

// Connecting to mongoDB
connectMongooseWithRetry()
  .catch(err => console.error('!mongodb> mongoose connection error', err))
  .finally(() => ready.mongo = true);

// Creating web server
const app = express();

// CORS config
if (config.corsAllowedOrigin) {
  app.use(cors({origin: config.corsAllowedOrigin, optionsSuccessStatus: 200, credentials: true}));
} else {
  app.use(cors());
}

// Body and URL parsing middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// HTTP healthCheck route
app.get('/healthCheck', (request, response) => {
  response.send({hostname: request.hostname, status: 'ok', version: config.version});
});

app.get('/ready', (request, response) => {
  response.status(Object.values(ready).every(r => r) ? 200 : 503).send(ready);
});

// Logger middleware
app.use(loggerMiddleware);

// Routes
app.use('/games', gamesRouter);

// 404
app.use((req, res, next) => {
  if (!res.headersSent) {
    next(new HttpError(404, 'Not Found', `No response for: ${req.path}`));
  }
});

// Custom error handler
app.use(customErrorHandler);

// HTTP server
const http: HttpServer = createServer(app);
http.listen(
  config.port,
  () => console.log(`Count Together backend ${config.version} listening on port ${config.port}`),
);

// Socket.IO server with CORS config
const io = new Server(
  http,
  config.sioAllowedOrigin
    ? {cors: {origin: config.sioAllowedOrigin.split(',')}}
    : {cors: {origin: true}},
);

// hotel
const hotel = new GameHotel(io);
HotelProvider.registerHotel(hotel);

// Socket.IO new connection
io.on('connection', (socket: Socket) => onConnection(socket, hotel));
