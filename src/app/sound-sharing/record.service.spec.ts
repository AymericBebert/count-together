import {provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {translateTestingModule} from '../testing/translate-testing-module';
import {BrowserCompatibilityService} from './browser-compatibility.service';
import {RecordService} from './record.service';

describe('RecordService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      translateTestingModule,
    ],
    providers: [
      provideZonelessChangeDetection(),
      RecordService,
      BrowserCompatibilityService,
    ],
  }));

  it('should be created', () => {
    const service: RecordService = TestBed.inject(RecordService);
    expect(service).toBeTruthy();
  });
});
