import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {BrowserCompatibilityService} from './browser-compatibility.service';
import {DebugItemModule} from './debug-item/debug-item.module';
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
    DebugItemModule,
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
