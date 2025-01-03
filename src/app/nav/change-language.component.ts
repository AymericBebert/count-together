import {Component, inject, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-change-language',
  template: `
    <div (click)="$event.stopPropagation()" [matMenuTriggerFor]="menu">
      <mat-icon style="margin-right: 5px; vertical-align: text-bottom;">arrow_drop_down</mat-icon>
      <span>{{ 'misc.language' | translate }}&ensp;
        <span class="lang-flag">{{ langToFlag(translate.currentLang) }}</span>{{ translate.currentLang }}
      </span>
      <mat-menu #menu="matMenu">
        @for (lang of translate.langs; track lang) {
          <button mat-menu-item (click)="langClicked(lang)">
            <span class="lang-flag">{{ langToFlag(lang) }}</span>{{ lang }}
          </button>
        }
      </mat-menu>
    </div>`,
  styles: ['span.lang-flag { vertical-align: middle; }'],
  imports: [
    TranslateModule,
    MatMenuModule,
    MatIconModule,
  ],
})
export class ChangeLanguageComponent {
  public readonly translate = inject(TranslateService);

  public readonly langSet = output<string>();

  public flagMap: Record<string, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
    unknown: '🏳️',
  };

  public langToFlag(lang: string): string {
    return this.flagMap[lang] || this.flagMap.unknown;
  }

  langClicked(lang: string): void {
    this.langSet.emit(lang);
  }
}
