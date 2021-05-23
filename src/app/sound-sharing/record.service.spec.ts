import {TestBed} from '@angular/core/testing';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {BrowserCompatibilityService} from './browser-compatibility.service';
import {RecordService} from './record.service';

describe('RecordService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateTestingModule,
    ],
    providers: [
      RecordService,
      BrowserCompatibilityService,
    ],
  }));

  it('should be created', () => {
    const service: RecordService = TestBed.inject(RecordService);
    expect(service).toBeTruthy();
  });
});
