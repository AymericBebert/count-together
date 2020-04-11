import {Injectable} from '@angular/core';
import {fromEvent, Observable, Subject} from 'rxjs';
import {take, takeUntil, tap} from 'rxjs/operators';
import * as io from 'socket.io-client';
import {environment} from 'src/environments/environment';
import {EmittedEventTypes, ReceivedEventTypes} from './socket-event-types';

@Injectable()
export class SocketService {

  private socket: SocketIOClient.Socket | null = null;

  private disconnect$ = new Subject<void>();

  constructor() {
  }

  public connectSocket() {
    if (this.socket === null) {
      console.log('Connecting socket');
      this.socket = io(environment.backendUrl);
    }
  }

  public disconnectSocket() {
    if (this.socket !== null) {
      console.log('Disconnecting socket');
      this.disconnect$.next();
      this.socket.disconnect();
      this.socket.close();
      this.socket = null;
    }
  }

  public on<T extends keyof ReceivedEventTypes>(eventName: T): Observable<ReceivedEventTypes[T]> {
    console.log(`socket listening for "${eventName}"`);
    return fromEvent<ReceivedEventTypes[T]>(this.socket, eventName)
      .pipe(tap(data => environment.debugSocket && console.log(`socket> ${eventName}:`, data)), takeUntil(this.disconnect$));
  }

  public once<T extends keyof ReceivedEventTypes>(eventName: T): Observable<ReceivedEventTypes[T]> {
    return this.on<T>(eventName).pipe(take(1));
  }

  public emit<T extends keyof EmittedEventTypes>(eventName: T, ...args: Array<EmittedEventTypes[T]>): void {
    if (this.socket === null) {
      return;
    }
    if (environment.debugSocket) {
      console.log(`socket< ${eventName}:`, args?.[0]);
    }
    this.socket.emit(eventName, ...args);
  }
}
