import {Component, EventEmitter, Output} from '@angular/core';
import {NavService} from '../service/nav.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-change-language-list-item',
  template: `<mat-list-item (click)="$event.stopPropagation()" [matMenuTriggerFor]="menu">
      <mat-icon style="margin-right: 8px">arrow_drop_down</mat-icon>
      <span>
          {{'misc.language' | translate}}
          &ensp;·&ensp;
          <span class="lang-flag">{{langToFlag(translateService.currentLang)}}</span>{{translateService.currentLang}}
      </span>
      <mat-menu #menu="matMenu">
          <button mat-menu-item
                  *ngFor="let lang of translateService.langs"
                  (click)="navService.setLanguage(lang); langClicked()">
              <span class="lang-flag">{{langToFlag(lang)}}</span>{{lang}}
          </button>
      </mat-menu>
  </mat-list-item>`,
  styles: ['span.lang-flag { vertical-align: middle; }']
})
export class ChangeLanguageComponent {

  @Output() public langSet = new EventEmitter<void>();

  public flagMap: { [lang: string]: string } = {
    fr: '🇫🇷',
    en: '🇬🇧',
    unknown: '🏳️',
  };

  public langToFlag(lang: string): string {
    return this.flagMap[lang] || this.flagMap.unknown;
  }

  constructor(public navService: NavService, public translateService: TranslateService) {}

  langClicked() {
    this.langSet.emit();
  }
}
