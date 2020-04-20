import {Injectable} from '@angular/core';
import {UpdateActivatedEvent, UpdateAvailableEvent} from '@angular/service-worker';
import {Subject} from 'rxjs';

@Injectable()
export class UpdaterTestingService {

  public updatesAvailable$ = new Subject<UpdateAvailableEvent>();
  public updatesActivated$ = new Subject<UpdateActivatedEvent>();

  constructor() {
  }

  public update() {
    console.log('UpdaterTestingService.update() called');
  }
}
