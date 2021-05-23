import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {DebugItemComponent} from './debug-item.component';

@NgModule({
  declarations: [
    DebugItemComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    DebugItemComponent,
  ],
})
export class DebugItemModule {
}
