import {TestBed} from '@angular/core/testing';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {BrowserCompatibilityService} from './browser-compatibility.service';
import {RecordService} from './record.service';
import {SoundSharingService} from './sound-sharing.service';

describe('SoundSharingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateTestingModule,
    ],
    providers: [
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
