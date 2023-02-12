import {Component, Inject} from '@angular/core';
import {UntypedFormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface GameNameDialogData {
  name: string;
}

@Component({
  selector: 'app-game-name-dialog',
  templateUrl: './game-name-dialog.component.html',
  styleUrls: ['./game-name-dialog.component.scss']
})
export class GameNameDialogComponent {

  public name: UntypedFormControl;

  // @ViewChild('gameNameInput') gameNameInput: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: GameNameDialogData) {
    this.name = new UntypedFormControl(data.name, [Validators.required]);
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => this.gameNameInput.nativeElement.select(), 0);
  // }
}
