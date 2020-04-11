import {Component, OnInit} from '@angular/core';
import {GamesService} from '../service/games.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
              private gamesService: GamesService,
  ) {
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
}
