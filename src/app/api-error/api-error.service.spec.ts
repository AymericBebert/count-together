import {TestBed} from '@angular/core/testing';
import {ApiErrorService} from './api-error.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';

describe('ApiErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      MatSnackBarModule,
    ],
    providers: [
    ]
  }));

  it('should be created', () => {
    const service: ApiErrorService = TestBed.get(ApiErrorService);
    expect(service).toBeTruthy();
  });
});
