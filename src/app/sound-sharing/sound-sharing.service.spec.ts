import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {translateTestingModule} from '../testing/translate-testing-module';
import {BrowserCompatibilityService} from './browser-compatibility.service';
import {RecordService} from './record.service';
import {SoundSharingService} from './sound-sharing.service';

describe('SoundSharingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      translateTestingModule,
    ],
    providers: [
      provideExperimentalZonelessChangeDetection(),
      SoundSharingService,
      RecordService,
      BrowserCompatibilityService,
    ],
  }));

  it('should be created', () => {
    const service: SoundSharingService = TestBed.inject(SoundSharingService);
    expect(service).toBeTruthy();
  });
});
