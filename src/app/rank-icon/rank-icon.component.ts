import {Component, input} from '@angular/core';
import {IconCrownComponent} from '../icons/icon-crown.component';
import {IconTpComponent} from '../icons/icon-tp.component';

@Component({
  selector: 'app-rank-icon',
  templateUrl: './rank-icon.component.html',
  styleUrls: ['./rank-icon.component.scss'],
  imports: [
    IconCrownComponent,
    IconTpComponent,
  ],
})
export class RankIconComponent {
  public readonly rank = input(1);
  public readonly isLast = input(false);
  public readonly size = input(32);
}
