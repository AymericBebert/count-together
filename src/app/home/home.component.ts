import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {NewGameDialogComponent, NewGameDialogData} from '../dialogs/new-game-dialog/new-game-dialog.component';
import {IGame, IStoredGame} from '../model/game';
import {GamesService} from '../service/games.service';
import {NavButtonsService} from '../service/nav-buttons.service';
import {ImmediateErrorStateMatcher} from '../utils/error-state-matcher';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {

  public readonly gameFormControl: FormControl<string>;
  public matcher: ErrorStateMatcher = new ImmediateErrorStateMatcher();
  public deletion = false;

  public gameCheckPending$ = this.gamesService.gameCheckPending$;

  private rawVisitedGames$ = new BehaviorSubject<IStoredGame[]>([]);
  public visitedGames$: Observable<IStoredGame[]> = this.rawVisitedGames$.pipe(
    map(vg => vg.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))),
  );
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private gamesService: GamesService,
              private navButtonsService: NavButtonsService,
              private dialog: MatDialog,
  ) {
    this.getVisitedGames();
    this.gameFormControl = new FormControl('', {
      nonNullable: true,
      asyncValidators: [this.gamesService.gameExistsValidator()],
    });

    this.navButtonsService.navButtonClicked$('nav-tool.wheel')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['wheel'], {relativeTo: this.route}).catch(err => console.error('Navigation error', err));
      });
  }

  ngOnInit(): void {
    this.gamesService.gameCheck$
      .pipe(
        filter((game): game is IGame => !!game),
        takeUntil(this.destroy$),
      )
      .subscribe(game => {
        this.router.navigate(['..', 'game', game.gameId]).catch(err => console.error('Navigation error', err));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public visitedGameClicked(gameId: string) {
    if (this.deletion) {
      this.deleteVisitedGame(gameId);
    } else {
      this.router.navigate(['..', 'game', gameId]).catch(err => console.error('Navigation error', err));
    }
  }

  public newGameOpen() {
    const recentPlayers = this.gamesService.getRegisteredPlayers();
    const data: NewGameDialogData = {recentPlayers};
    this.dialog.open(NewGameDialogComponent, {data})
      .afterClosed()
      .pipe(
        filter<IGame>(res => res !== undefined),
        switchMap(res => this.gamesService.postNewGame$(res)),
        takeUntil(this.destroy$),
      )
      .subscribe(newGame => this.router.navigate(['game', newGame.gameId]));
  }

  // public newGame() {
  //   this.gamesService.postNewGame({
  //     gameId: 'new',
  //     name: this.translate.instant('new-game.name'),
  //     players: [{name: this.translate.instant('new-game.player-1'), scores: []}],
  //     gameType: 'free',
  //     lowerScoreWins: false,
  //   })
  //     .subscribe(newGame => this.router.navigate(['game', newGame.gameId]));
  // }

  public getVisitedGames() {
    this.rawVisitedGames$.next(this.gamesService.getVisitedGames());
  }

  public deleteVisitedGame(gameId: string) {
    this.rawVisitedGames$.next(this.gamesService.deleteVisitedGame(gameId));
  }

  public toggleDeletion() {
    this.deletion = !this.deletion;
  }
}
