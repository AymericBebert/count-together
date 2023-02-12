import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

export interface GameNameDialogData {
  name: string;
}

@Component({
  selector: 'app-game-name-dialog',
  templateUrl: './game-name-dialog.component.html',
  styleUrls: ['./game-name-dialog.component.scss']
})
export class GameNameDialogComponent {

  public name = new FormControl<string>(this.data.name, [Validators.required]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: GameNameDialogData) {
  }
}
