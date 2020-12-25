import {Component, OnDestroy, OnInit} from '@angular/core';
import {GamesService} from '../service/games.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {IStoredGame} from '../model/game';
import {filter, map, takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ImmediateErrorStateMatcher} from '../utils/error-state-matcher';
import {NavButtonsService} from '../service/nav-buttons.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private rawVisitedGames$ = new BehaviorSubject<IStoredGame[]>([]);

  public visitedGames$: Observable<IStoredGame[]> = this.rawVisitedGames$
    .pipe(map(vg => vg.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))));

  public gameFormControl: FormControl;
  public matcher: ErrorStateMatcher;
  public deletion = false;

  public gameCheckPending$ = this.gamesService.gameCheckPending$;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private gamesService: GamesService,
              private navButtonsService: NavButtonsService,
  ) {
    this.getVisitedGames();
    this.gameFormControl = new FormControl('', {
      asyncValidators: [this.gamesService.gameExistsValidator()],
    });
    this.matcher = new ImmediateErrorStateMatcher();

    this.navButtonsService.navButtonClicked$('nav-tool.wheel')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['wheel'], {relativeTo: this.route}).catch(err => console.error('Navigation error', err));
      });
  }

  ngOnInit(): void {
    this.gamesService.gameCheck$
      .pipe(
        filter(game => !!game),
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

  public newGame() {
    this.gamesService.postNewGame({
      gameId: 'new',
      name: 'New Game',
      players: [{name: 'P1', scores: []}],
      gameType: 'free',
      lowerScoreWins: false,
    })
      .subscribe(newGame => this.router.navigate(['game', newGame.gameId]));
  }

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
