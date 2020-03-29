import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface EditionDialogData {
  editScore?: {current: number | null, p: number, i: number};
  editPlayerName?: {current: string, p: number};
  editGame?: {current: string};
}

@Component({
  selector: 'app-edition-dialog',
  templateUrl: './edition-dialog.component.html',
  styleUrls: ['./edition-dialog.component.scss']
})
export class EditionDialogComponent implements OnInit {

  public editScoreValue: number | null;
  public editPlayerNameValue: string;
  public editGameValue: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditionDialogData) {
    if (data.editScore) {
      this.editScoreValue = data.editScore.current;
    } else if (data.editPlayerName) {
      this.editPlayerNameValue = data.editPlayerName.current;
    } else if (data.editGame) {
      this.editGameValue = data.editGame.current;
    }
  }

  ngOnInit(): void {
  }

  public returnValue(): string | number | null {
    if (this.data.editScore) {
      return this.editScoreValue;
    } else if (this.data.editPlayerName) {
      return this.editPlayerNameValue;
    } else if (this.data.editGame) {
      return this.editGameValue;
    }
  }

}
