import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-debug-item',
  templateUrl: './debug-item.component.html',
  styleUrls: ['./debug-item.component.scss']
})
export class DebugItemComponent {
  @Input() public isOk: boolean;
  @Input() public label: string;
}
