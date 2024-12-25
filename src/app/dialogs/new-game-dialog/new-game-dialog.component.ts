import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {TranslateModule} from '@ngx-translate/core';
import {IconCrownComponent} from '../../icons/icon-crown.component';
import {GameType, IGame, IRecentPlayer, PlayerEdition} from '../../model/game';
import {GamesService} from '../../service/games.service';

export interface NewGameDialogData {
  recentPlayers: IRecentPlayer[];
  fromGame?: IGame;
}

export interface NewGameDialogResult {
  game: IGame;
  playerEdition: PlayerEdition[];
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
    MatMenuModule,
    IconCrownComponent,
  ],
})
export class NewGameDialogComponent {
  private readonly data = inject<NewGameDialogData>(MAT_DIALOG_DATA);
  protected readonly fromGame = this.data.fromGame;
  private readonly gamesService = inject(GamesService, {optional: true});

  public readonly gameSettings = new FormGroup({
    gameName: new FormControl<string>(
      this.data.fromGame?.name || '',
      {nonNullable: true, validators: [Validators.required]},
    ),
    gameType: new FormControl<GameType>(this.data.fromGame?.gameType || 'free', {nonNullable: true}),
    lowerScoreWins: new FormControl<boolean>(this.data.fromGame?.lowerScoreWins || false, {nonNullable: true}),
  });

  public readonly playerName = new FormControl<string>('', {nonNullable: true});

  public readonly selectedPlayers = signal<PlayerEdition[]>([]);
  public readonly otherPlayers = signal<PlayerEdition[]>([]);

  constructor() {
    if (this.data.fromGame) {
      const gamePlayers = this.data.fromGame.players.map(player => player.name);
      this.selectedPlayers.set(gamePlayers.map(((playerName, i) => ({playerName, oldPlayerId: i}))));
      this.otherPlayers.set(this.data.recentPlayers
        .filter(rp => !gamePlayers.includes(rp.name))
        .map(rp => ({playerName: rp.name, oldPlayerId: -1})));
    } else {
      this.selectedPlayers.set(this.data.recentPlayers
        .filter(rp => rp.wasLatest)
        .map(rp => ({playerName: rp.name, oldPlayerId: -1})));
      this.otherPlayers.set(this.data.recentPlayers
        .filter(rp => !rp.wasLatest)
        .map(rp => ({playerName: rp.name, oldPlayerId: -1})));
    }
  }

  public exportGame(): NewGameDialogResult {
    const gameSettings = this.gameSettings.getRawValue();
    return {
      game: {
        gameId: 'new',
        name: gameSettings.gameName,
        gameType: gameSettings.gameType,
        lowerScoreWins: gameSettings.lowerScoreWins,
        players: this.selectedPlayers().map(player => ({
          name: player.playerName,
          scores: [],
        })),
      },
      playerEdition: this.selectedPlayers(),
    };
  }

  public drop(event: CdkDragDrop<PlayerEdition[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  public addPlayerName(): void {
    this.selectedPlayers.update(players => [
      ...players.filter(p => p.playerName !== this.playerName.value),
      {playerName: this.playerName.value, oldPlayerId: -1},
    ]);
    this.playerName.setValue('');
  }

  public includePlayer(player: PlayerEdition): void {
    this.selectedPlayers.update(players => [
      ...players.filter(p => p.playerName !== player.playerName),
      player,
    ]);
    this.otherPlayers.update(players => players.filter(p => p.playerName !== player.playerName));
  }

  public excludePlayer(player: PlayerEdition): void {
    this.selectedPlayers.update(players => players.filter(p => p.playerName !== player.playerName));
    this.otherPlayers.update(players => [
      player,
      ...players.filter(p => p.playerName !== player.playerName),
    ]);
  }

  public forgetPlayer(player: PlayerEdition): void {
    this.selectedPlayers.update(players => players.filter(p => p.playerName !== player.playerName));
    this.otherPlayers.update(players => players.filter(p => p.playerName !== player.playerName));
    this.gamesService?.forgetPlayer(player.playerName);
  }
}
