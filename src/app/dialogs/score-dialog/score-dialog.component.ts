import {Component, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

export interface EditScoreDialogData {
  score: number | null;
  isNew: boolean;
}

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.scss']
})
export class ScoreDialogComponent {

  public readonly score = new FormControl<number | null>(this.data.score);
  public readonly isNew = this.data.isNew;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditScoreDialogData) {
  }
}
