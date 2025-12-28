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
import {
  NewGameDialogComponent,
  NewGameDialogData,
  NewGameDialogResult
} from '../dialogs/new-game-dialog/new-game-dialog.component';
import {IStoredGame} from '../model/game';
import {NavButtonsService} from '../nav/nav-buttons.service';
import {GamesService} from '../service/games.service';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gamesService = inject(GamesService);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public readonly gameFormControl = new FormControl('', {
    nonNullable: true,
    asyncValidators: [this.gamesService.gameExistsValidator()],
  });
  public readonly matcher: ErrorStateMatcher = new ImmediateErrorStateMatcher();
  public readonly deletion = signal<boolean>(false);

  public readonly gameCheckPending = this.gamesService.gameCheckPending;

  public readonly visitedGames = signal<IStoredGame[]>([]);

  constructor() {
    this.getVisitedGames();

    this.navButtonsService.navButtonClicked$('nav-tool.wheel')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
        void this.router.navigate(['wheel'], {...btn.navigationExtras, relativeTo: this.route});
      });
  }

  ngOnInit(): void {
    this.gamesService.gameCheck$
      .pipe(
        filter(game => !!game),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(game => {
        void this.router.navigate(['game', game.gameId]);
      });
  }

  public visitedGameClicked(gameId: string) {
    if (this.deletion()) {
      this.deleteVisitedGame(gameId);
    } else {
      void this.router.navigate(['game', gameId]);
    }
  }

  public newGameOpen() {
    const recentPlayers = this.gamesService.getRegisteredPlayers();
    this.dialog.open<NewGameDialogComponent, NewGameDialogData, NewGameDialogResult>(
      NewGameDialogComponent,
      {
        data: {recentPlayers},
        closeOnNavigation: false,
      },
    )
      .afterClosed()
      .pipe(
        filter(res => res !== undefined),
        switchMap(res => this.gamesService.postNewGame$(res.game)),
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
