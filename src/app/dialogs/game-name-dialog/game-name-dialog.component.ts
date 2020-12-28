import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

export interface GameNameDialogData {
  name: string;
}

@Component({
  selector: 'app-game-name-dialog',
  templateUrl: './game-name-dialog.component.html',
  styleUrls: ['./game-name-dialog.component.scss']
})
export class GameNameDialogComponent implements AfterViewInit {

  public name: FormControl;

  @ViewChild('gameNameInput') gameNameInput: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: GameNameDialogData) {
    this.name = new FormControl(data.name, [Validators.required]);
  }

  ngAfterViewInit(): void {
    // setTimeout(() => this.gameNameInput.nativeElement.select(), 0);
  }
}
