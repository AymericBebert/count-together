import {Component, Inject} from '@angular/core';
import {UntypedFormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface PlayerNameDialogData {
  name: string;
  isNew: boolean;
}

@Component({
  selector: 'app-player-name-dialog',
  templateUrl: './player-name-dialog.component.html',
  styleUrls: ['./player-name-dialog.component.scss']
})
export class PlayerNameDialogComponent {

  public name: UntypedFormControl;
  public isNew: boolean;

  // @ViewChild('playerNameInput') playerNameInput: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PlayerNameDialogData) {
    this.name = new UntypedFormControl(data.name, [Validators.required]);
    this.isNew = data.isNew;
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => this.playerNameInput.nativeElement.select(), 0);
  // }
}
