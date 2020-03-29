import {TestBed} from '@angular/core/testing';

import {NavService} from './nav.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {CookieService} from 'ngx-cookie-service';

describe('NavService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      TranslateTestingModule,
      RouterTestingModule,
    ],
    providers: [
      CookieService,
    ],
  }));

  it('should be created', () => {
    const service: NavService = TestBed.inject(NavService);
    expect(service).toBeTruthy();
  });
});