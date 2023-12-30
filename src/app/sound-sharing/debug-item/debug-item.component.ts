import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-debug-item',
  templateUrl: './debug-item.component.html',
  styleUrls: ['./debug-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
})
export class DebugItemComponent {
  @Input() public isOk!: boolean;
  @Input() public label!: string;
}
