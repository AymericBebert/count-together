import {Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-debug-item',
  templateUrl: './debug-item.component.html',
  styleUrls: ['./debug-item.component.scss'],
  imports: [
    MatIcon,
  ],
})
export class DebugItemComponent {
  public readonly isOk = input.required<boolean>();
  public readonly label = input.required<string>();
}
