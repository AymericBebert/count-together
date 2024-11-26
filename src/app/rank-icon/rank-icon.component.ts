import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-rank-icon',
  templateUrl: './rank-icon.component.html',
  styleUrls: ['./rank-icon.component.scss'],
  imports: [
    CommonModule,
  ],
})
export class RankIconComponent {
  @Input() public rank = 1;
  @Input() public isLast = false;
}
