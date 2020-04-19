import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';

@Injectable()
export class UpdaterService {

  public updatesAvailable$ = this.updates.available;
  public updatesActivated$ = this.updates.activated;

  constructor(private updates: SwUpdate) {
    updates.available.subscribe(event => {
      console.log('Current version is', event.current);
      console.log('Available version is', event.available);
    });
    updates.activated.subscribe(event => {
      console.log('Old version was', event.previous);
      console.log('New version is', event.current);
    });
  }

  public update() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
