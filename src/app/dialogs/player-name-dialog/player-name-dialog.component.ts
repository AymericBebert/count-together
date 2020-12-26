import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

export interface PlayerNameDialogData {
  name: string;
}

@Component({
  selector: 'app-player-name-dialog',
  templateUrl: './player-name-dialog.component.html',
  styleUrls: ['./player-name-dialog.component.scss']
})
export class PlayerNameDialogComponent implements AfterViewInit {

  public name: FormControl;

  @ViewChild('playerNameInput') playerNameInput: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PlayerNameDialogData) {
    this.name = new FormControl(data.name, [Validators.required]);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.playerNameInput.nativeElement.select(), 0);
  }
}
