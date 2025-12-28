import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {ConfigTestingModule} from '../testing/config-testing.module';
import {translateTestingModule} from '../testing/translate-testing-module';
import {UpdaterTestingModule} from '../testing/updater-testing.module';
import {NavService} from './nav.service';

describe('NavService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      translateTestingModule,
      ConfigTestingModule,
      UpdaterTestingModule,
    ],
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
    ],
  }));

  it('should be created', () => {
    const service = TestBed.inject(NavService);
    expect(service).toBeTruthy();
  });
});
