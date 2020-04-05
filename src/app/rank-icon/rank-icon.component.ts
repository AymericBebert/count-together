import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rank-icon',
  templateUrl: './rank-icon.component.html',
  styleUrls: ['./rank-icon.component.scss']
})
export class RankIconComponent implements OnInit {

  @Input() public rank = 1;
  @Input() public isLast = false;

  constructor() { }

  ngOnInit(): void {
  }

}
