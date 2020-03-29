import {TestBed} from '@angular/core/testing';
import {CookieService} from 'ngx-cookie-service';

import {StorageService} from './storage.service';

describe('StorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CookieService,
    ]
  }));

  it('should be created', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service).toBeTruthy();
  });
});
