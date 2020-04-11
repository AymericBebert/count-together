import {TestBed} from '@angular/core/testing';

import {ShareButtonService} from './share-button.service';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {MatSnackBarModule} from '@angular/material/snack-bar';

describe('ShareButtonService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateTestingModule,
      MatSnackBarModule,
    ],
  }));

  it('should be created', () => {
    const service: ShareButtonService = TestBed.inject(ShareButtonService);
    expect(service).toBeTruthy();
  });
});
