import {TestBed} from '@angular/core/testing';
import {ApiErrorService} from './api-error.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';

describe('ApiErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      MatSnackBarModule,
    ],
    providers: [
      ApiErrorService,
    ]
  }));

  it('should be created', () => {
    const service: ApiErrorService = TestBed.inject(ApiErrorService);
    expect(service).toBeTruthy();
  });
});
