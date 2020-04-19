import {TestBed} from '@angular/core/testing';
import {CookieService} from 'ngx-cookie-service';

import {UpdaterService} from './updater.service';

describe('UpdaterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CookieService,
    ],
  }));

  it('should be created', () => {
    const service: UpdaterService = TestBed.inject(UpdaterService);
    expect(service).toBeTruthy();
  });
});
