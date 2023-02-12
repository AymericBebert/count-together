import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

export interface PlayerNameDialogData {
  name: string;
  isNew: boolean;
}

export type PlayerNameDialogResult = string | null;

@Component({
  selector: 'app-player-name-dialog',
  templateUrl: './player-name-dialog.component.html',
  styleUrls: ['./player-name-dialog.component.scss']
})
export class PlayerNameDialogComponent {

  public readonly name = new FormControl<string>(this.data.name, [Validators.required]);
  public readonly isNew = this.data.isNew;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PlayerNameDialogData) {
  }
}
