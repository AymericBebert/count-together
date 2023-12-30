import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

// @ts-ignore
@Component({
  selector: 'app-translation-markers',
  template: '<p>Nope</p>',
  standalone: true,
})
export class TranslationMarkersComponent {
  constructor(public translate: TranslateService) {

    // Translation markers so that ngx-translate-extract will extract them

    translate.instant([
      'nav-tool.wheel',
      'nav-tool.sound-share',
      'nav-tool.duplicate',
      'nav-tool.save-offline',
      'main-title.wheel',
      'main-title.sound-share',
      'main-title.sound-share-debug',
    ]);
  }
}
