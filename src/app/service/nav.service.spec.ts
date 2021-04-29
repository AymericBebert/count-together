import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {StorageModule} from '../storage/storage.module';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {UpdaterTestingModule} from '../testing/updater-testing.module';
import {DeviceService} from './device.service';
import {NavButtonsService} from './nav-buttons.service';
import {NavService} from './nav.service';
import {SettingsService} from './settings.service';

describe('NavService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      TranslateTestingModule,
      RouterTestingModule,
      StorageModule,
      UpdaterTestingModule,
    ],
    providers: [
      NavService,
      NavButtonsService,
      SettingsService,
      DeviceService,
    ],
  }));

  it('should be created', () => {
    const service: NavService = TestBed.inject(NavService);
    expect(service).toBeTruthy();
  });
});
