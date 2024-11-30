import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {filter, switchMap} from 'rxjs/operators';
import {NewGameDialogComponent, NewGameDialogData} from '../dialogs/new-game-dialog/new-game-dialog.component';
import {IGame, IStoredGame} from '../model/game';
import {GamesService} from '../service/games.service';
import {NavButtonsService} from '../service/nav-buttons.service';
import {ImmediateErrorStateMatcher} from '../utils/error-state-matcher';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
})
export class HomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gamesService = inject(GamesService);
  private navButtonsService = inject(NavButtonsService);
  private dialog = inject(MatDialog);

  public readonly gameFormControl = new FormControl('', {
    nonNullable: true,
    asyncValidators: [this.gamesService.gameExistsValidator()],
  });
  public readonly matcher: ErrorStateMatcher = new ImmediateErrorStateMatcher();
  public readonly deletion = signal<boolean>(false);

  public readonly gameCheckPending = this.gamesService.gameCheckPending;

  public readonly visitedGames = signal<IStoredGame[]>([]);

  constructor(private readonly destroyRef: DestroyRef) {
    this.getVisitedGames();

    this.navButtonsService.navButtonClicked$('nav-tool.wheel')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['wheel'], {relativeTo: this.route}).catch(err => console.error('Navigation error', err));
      });
  }

  ngOnInit(): void {
    this.gamesService.gameCheck$
      .pipe(
        filter(game => !!game),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(game => {
        this.router.navigate(['..', 'game', game.gameId]).catch(err => console.error('Navigation error', err));
      });
  }

  public visitedGameClicked(gameId: string) {
    if (this.deletion()) {
      this.deleteVisitedGame(gameId);
    } else {
      this.router.navigate(['..', 'game', gameId]).catch(err => console.error('Navigation error', err));
    }
  }

  public newGameOpen() {
    const recentPlayers = this.gamesService.getRegisteredPlayers();
    this.dialog.open<NewGameDialogComponent, NewGameDialogData, IGame>(
      NewGameDialogComponent,
      {data: {recentPlayers}},
    )
      .afterClosed()
      .pipe(
        filter(res => res !== undefined),
        switchMap(res => this.gamesService.postNewGame$(res)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(newGame => this.router.navigate(['game', newGame.gameId]));
  }

  private setVisitedGames(rooms: IStoredGame[]): void {
    this.visitedGames.set(rooms.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)));
  }

  public getVisitedGames() {
    this.setVisitedGames(this.gamesService.getVisitedGames());
  }

  public deleteVisitedGame(gameId: string) {
    this.setVisitedGames(this.gamesService.deleteVisitedGame(gameId));
  }

  public toggleDeletion() {
    this.deletion.update(deletion => !deletion);
  }
}
