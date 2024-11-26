import {CommonModule} from '@angular/common';
import {Component, input} from '@angular/core';

@Component({
  selector: 'app-rank-icon',
  templateUrl: './rank-icon.component.html',
  styleUrls: ['./rank-icon.component.scss'],
  imports: [
    CommonModule,
  ],
})
export class RankIconComponent {
  public readonly rank = input(1);
  public readonly isLast = input(false);
}
