import {Component, OnInit} from '@angular/core';
import {GamesService} from '../service/games.service';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {StoredGame} from '../model/game';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private rawVisitedGames$ = new BehaviorSubject<StoredGame[]>([]);

  public visitedGames$: Observable<StoredGame[]> = this.rawVisitedGames$
    .pipe(map(vg => vg.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))));

  public deletion = false;

  constructor(private router: Router,
              private gamesService: GamesService,
  ) {
    this.getVisitedGames();
  }

  ngOnInit(): void {
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
      players: [{name: '<P1>', scores: []}],
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
