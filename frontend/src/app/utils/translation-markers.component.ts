import {Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-translation-markers',
  template: '<p>Nope</p>',
})
export class TranslationMarkersComponent {
  private readonly translate = inject(TranslateService);

  constructor() {
    const translate = this.translate;

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
