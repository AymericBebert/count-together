import {Component, OnInit} from '@angular/core';
import {GamesService} from '../service/games.service';
import {Router} from '@angular/router';
import {StorageService} from '../storage/storage.service';
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

  constructor(private router: Router,
              private gamesService: GamesService,
              private storageService: StorageService,
  ) {
    this.getVisitedGames();
  }

  ngOnInit(): void {
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
    const visitedGamesFromStorage = this.storageService.getItem('visitedGames') || '[]';
    const parsedVisitedGames: StoredGame[] = JSON.parse(visitedGamesFromStorage).map(g => ({...g, date: new Date(g.date)}));
    this.rawVisitedGames$.next(parsedVisitedGames);
  }
}
