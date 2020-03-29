import {Component, OnInit} from '@angular/core';
import {Game} from '../model/game';
import {Observable, of} from 'rxjs';
import {EnrichedPlayer} from '../model/player';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  public game$: Observable<Game> = of({
    id: 'offline',
    name: 'Test Game',
    lowerScoreWins: true,
    players: [
      {
        name: 'Aymeric',
        scores: [12, 5, 2, 4],
      },
      {
        name: 'Loulou',
        scores: [15, 7, 3, 2],
      },
      {
        name: 'Cloclo',
        scores: [24, -5, 12, null],
      },
    ],
  });

  public players$: Observable<EnrichedPlayer[]> = this.game$.pipe(
    map(game => game.players),
    map(players => {
      const playersNoRank = players.map(player => ({
        ...player,
        track: `${player.name}_${player.scores}`,
        ...GameComponent.cumSum(player.scores),
      }));
      const totals = playersNoRank.map(player => player.total).sort();
      return playersNoRank.map(player => ({...player, rank: totals.indexOf(player.total)  + 1}));
    }),
  );

  private static cumSum(scores: (number | null)[]): { scoresCumSum: number[], total: number } {
    return scores.reduce(
      (acc, score) => ({scoresCumSum: [...acc.scoresCumSum, acc.total + score], total: acc.total + score}),
      {total: 0, scoresCumSum: [] as number[]},
    );
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
