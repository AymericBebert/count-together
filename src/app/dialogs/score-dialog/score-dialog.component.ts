import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';

export interface EditScoreDialogData {
  score: number | null;
  isNew: boolean;
}

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.scss']
})
export class ScoreDialogComponent implements AfterViewInit {

  public score: FormControl;
  public isNew: boolean;

  @ViewChild('scoreInput') scoreInput: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditScoreDialogData) {
    this.score = new FormControl(data.score);
    this.isNew = data.isNew;
  }

  ngAfterViewInit(): void {
    // setTimeout(() => this.scoreInput.nativeElement.select(), 0);
  }
}
