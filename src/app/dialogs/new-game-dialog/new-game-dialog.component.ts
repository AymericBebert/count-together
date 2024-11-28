import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslateModule} from '@ngx-translate/core';
import {GameType, IGame, IRecentPlayer} from '../../model/game';
import {GamesService} from '../../service/games.service';

export interface NewGameDialogData {
  recentPlayers: IRecentPlayer[];
}

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.scss'],
  imports: [
    TranslateModule,
    DragDropModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class NewGameDialogComponent {
  public readonly data = inject<NewGameDialogData>(MAT_DIALOG_DATA);
  private readonly gamesService = inject(GamesService, {optional: true});

  public readonly gameName = new FormControl<string>('', {nonNullable: true, validators: [Validators.required]});
  public readonly gameType = new FormControl<GameType>('free', {nonNullable: true});
  public readonly lowerScoreWins = new FormControl<boolean>(false, {nonNullable: true});
  public readonly playerName = new FormControl<string>('', {nonNullable: true});

  public selectedPlayers: string[] = [];
  public otherPlayers: string[] = [];

  constructor() {
    const data = this.data;

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

  public drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  public addPlayerName(): void {
    this.selectedPlayers = [...this.selectedPlayers.filter(n => n !== this.playerName.value), this.playerName.value];
    this.playerName.setValue('');
  }

  public excludePlayer(playerName: string): void {
    this.selectedPlayers = this.selectedPlayers.filter(n => n !== playerName);
    this.otherPlayers = [playerName, ...this.otherPlayers.filter(n => n !== playerName)];
  }

  public forgetPlayer(playerName: string): void {
    this.selectedPlayers = this.selectedPlayers.filter(n => n !== playerName);
    this.otherPlayers = this.otherPlayers.filter(n => n !== playerName);
    this.gamesService?.forgetPlayer(playerName);
  }
}
