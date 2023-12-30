import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {BrowserCompatibilityService} from './browser-compatibility.service';
import {DebugItemComponent} from './debug-item/debug-item.component';
import {SoundDebugComponent} from './sound-debug/sound-debug.component';
import {SoundSharingRoutingModule} from './sound-sharing-routing.module';
import {SoundSharingComponent} from './sound-sharing/sound-sharing.component';

@NgModule({
  declarations: [
    SoundSharingComponent,
    SoundDebugComponent,
  ],
  imports: [
    SoundSharingRoutingModule,
    DebugItemComponent,
    CommonModule,
    TranslateModule.forChild(),
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    SoundSharingComponent,
    SoundDebugComponent,
  ],
  providers: [
    BrowserCompatibilityService,
  ],
})
export class SoundSharingModule {
}
