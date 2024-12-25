import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {APP_CONFIG, appConfigFactory} from '../../config/app.config';
import {translateTestingModule} from '../testing/translate-testing-module';
import {UpdaterTestingModule} from '../testing/updater-testing.module';
import {DeviceService} from './device.service';
import {NavButtonsService} from './nav-buttons.service';
import {NavService} from './nav.service';
import {SettingsService} from './settings.service';

describe('NavService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      translateTestingModule,
      RouterTestingModule,
      UpdaterTestingModule,
    ],
    providers: [
      provideExperimentalZonelessChangeDetection(),
      {provide: APP_CONFIG, useFactory: appConfigFactory},
      NavService,
      NavButtonsService,
      SettingsService,
      DeviceService,
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
    ],
  }));

  it('should be created', () => {
    const service: NavService = TestBed.inject(NavService);
    expect(service).toBeTruthy();
  });
});
