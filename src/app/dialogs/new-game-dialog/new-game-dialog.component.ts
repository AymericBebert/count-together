import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, Inject, Optional} from '@angular/core';
import {UntypedFormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {IGame, IRecentPlayer} from '../../model/game';
import {GamesService} from '../../service/games.service';

export interface NewGameDialogData {
  recentPlayers: IRecentPlayer[];
}

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.scss']
})
export class NewGameDialogComponent {

  public gameName: UntypedFormControl;
  public gameType: UntypedFormControl;
  public lowerScoreWins: UntypedFormControl;
  public playerName: UntypedFormControl;

  public selectedPlayers: string[] = [];
  public otherPlayers: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: NewGameDialogData,
              @Optional() private gamesService: GamesService,
  ) {
    this.gameName = new UntypedFormControl('', [Validators.required]);
    this.gameType = new UntypedFormControl('free');
    this.lowerScoreWins = new UntypedFormControl(false);
    this.playerName = new UntypedFormControl('');

    data.recentPlayers.forEach(rp => {
      if (rp.wasLatest) {
        this.selectedPlayers.push(rp.name);
      } else {
        this.otherPlayers.push(rp.name);
      }
    });
  }

  public exportGame(): IGame {
    return {
      gameId: 'new',
      name: this.gameName.value,
      gameType: this.gameType.value,
      lowerScoreWins: this.lowerScoreWins.value,
      players: this.selectedPlayers.map(name => ({name, scores: []})),
    };
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  public addPlayerName() {
    this.selectedPlayers = [...this.selectedPlayers.filter(n => n !== this.playerName.value), this.playerName.value];
    this.playerName.setValue('');
  }

  public excludePlayer(playerName: string) {
    this.selectedPlayers = this.selectedPlayers.filter(n => n !== playerName);
    this.otherPlayers = [playerName, ...this.otherPlayers.filter(n => n !== playerName)];
  }

  public forgetPlayer(playerName: string) {
    this.selectedPlayers = this.selectedPlayers.filter(n => n !== playerName);
    this.otherPlayers = this.otherPlayers.filter(n => n !== playerName);
    this.gamesService?.forgetPlayer(playerName);
  }
}
