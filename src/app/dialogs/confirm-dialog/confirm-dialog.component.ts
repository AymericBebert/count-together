import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirm: string;
  dismiss: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
})
export class ConfirmDialogComponent {
  public readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
