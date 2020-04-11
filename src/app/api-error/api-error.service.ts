import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorService {

  constructor(private snackBar: MatSnackBar) {
    this.apiError$.subscribe(msg => this._displayError(msg));
  }

  private apiError$ = new Subject<string>();

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
