import {Injectable} from '@angular/core';
import {UpdateActivatedEvent, UpdateAvailableEvent} from '@angular/service-worker';
import {Subject} from 'rxjs';

@Injectable()
export class UpdaterTestingService {

  // noinspection JSUnusedGlobalSymbols
  public updatesAvailable$ = new Subject<UpdateAvailableEvent>();

  // noinspection JSUnusedGlobalSymbols
  public updatesActivated$ = new Subject<UpdateActivatedEvent>();

  public update() {
    console.log('UpdaterTestingService.update() called');
  }
}
