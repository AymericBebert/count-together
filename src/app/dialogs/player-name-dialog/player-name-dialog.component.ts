import {CommonModule} from '@angular/common';
import {Component, Inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';

export interface PlayerNameDialogData {
  name: string;
  isNew: boolean;
}

export type PlayerNameDialogResult = string | null;

@Component({
  selector: 'app-player-name-dialog',
  templateUrl: './player-name-dialog.component.html',
  styleUrls: ['./player-name-dialog.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
  ],
})
export class PlayerNameDialogComponent {

  public readonly name = new FormControl<string>(
    this.data.name,
    {nonNullable: true, validators: [Validators.required]},
  );
  public readonly isNew = this.data.isNew;

  constructor(public readonly ref: MatDialogRef<PlayerNameDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly data: PlayerNameDialogData,
  ) {
  }
}
