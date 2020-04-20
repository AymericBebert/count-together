import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

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
