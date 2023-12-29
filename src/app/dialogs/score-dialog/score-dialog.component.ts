import {CommonModule} from '@angular/common';
import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';

export interface EditScoreDialogData {
  score: number | null;
  isNew: boolean;
}

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class ScoreDialogComponent {

  public readonly isNew = this.data.isNew;
  public score: number | null = this.data.score;

  constructor(public readonly ref: MatDialogRef<ScoreDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly data: EditScoreDialogData,
  ) {
  }
}
