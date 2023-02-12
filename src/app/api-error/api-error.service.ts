import {Injectable} from '@angular/core';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {Subject} from 'rxjs';

@Injectable()
export class ApiErrorService {

  private apiError$ = new Subject<string>();

  constructor(private snackBar: MatSnackBar) {
    this.apiError$.subscribe(msg => this._displayError(msg));
  }

  public displayError(err: string) {
    this.apiError$.next(err);
  }

  private _displayError(err: string) {
    console.error(`API error: ${err}`);
    this.snackBar.open(err, '', {
      duration: 3000,
    });
  }
}
