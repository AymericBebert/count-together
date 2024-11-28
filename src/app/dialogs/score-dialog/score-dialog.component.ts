import {Component, inject} from '@angular/core';
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
  imports: [
    TranslateModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class ScoreDialogComponent {
  public readonly ref = inject<MatDialogRef<ScoreDialogComponent>>(MatDialogRef);
  private readonly data = inject<EditScoreDialogData>(MAT_DIALOG_DATA);

  public readonly isNew = this.data.isNew;
  public score: number | null = this.data.score;
}
