import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorService {
  constructor(private readonly snackBar: MatSnackBar) {
  }

  public displayError(err: string, error?: any): void {
    console.error(`API error: ${err}${error ? ` (${error})` : ''}`);
    this.snackBar.open(err, '', {
      duration: 3000,
    });
  }
}
