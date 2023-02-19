import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirm: string;
  dismiss: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  title: string;
  message: string;
  confirm: string;
  dismiss: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    this.title = data.title;
    this.message = data.message;
    this.confirm = data.confirm;
    this.dismiss = data.dismiss;
  }
}
