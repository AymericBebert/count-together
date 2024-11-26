import {CommonModule} from '@angular/common';
import {Component, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-change-language',
  template: `
    <div (click)="$event.stopPropagation()" [matMenuTriggerFor]="menu">
      <mat-icon style="margin-right: 5px; vertical-align: text-bottom;">arrow_drop_down</mat-icon>
      <span>{{ 'misc.language' | translate }}&ensp;
        <span class="lang-flag">{{ langToFlag(translateService.currentLang) }}</span>{{ translateService.currentLang }}
      </span>
      <mat-menu #menu="matMenu">
        <button mat-menu-item *ngFor="let lang of translateService.langs" (click)="langClicked(lang)">
          <span class="lang-flag">{{ langToFlag(lang) }}</span>{{ lang }}
        </button>
      </mat-menu>
    </div>`,
  styles: ['span.lang-flag { vertical-align: middle; }'],
  imports: [
    CommonModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
  ],
})
export class ChangeLanguageComponent {

  public readonly langSet = output<string>();

  public flagMap: Record<string, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
    unknown: '🏳️',
  };

  constructor(public translateService: TranslateService) {
  }

  public langToFlag(lang: string): string {
    return this.flagMap[lang] || this.flagMap.unknown;
  }

  public langClicked(lang: string) {
    this.langSet.emit(lang);
  }
}
