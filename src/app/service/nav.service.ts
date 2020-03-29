import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {StorageService} from './storage.service';
import {NavButtonsService} from './nav-buttons.service';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public showBackButton$ = new BehaviorSubject<boolean>(false);
  public navButtons$ = new BehaviorSubject<string[]>([]);
  // public mainTitle$ = new BehaviorSubject<string>('');

  public language$ = new BehaviorSubject<string>('');

  constructor(private router: Router,
              private navButtonsService: NavButtonsService,
              private translateService: TranslateService,
              private storageService: StorageService,
  ) {
  }

  public setBackRouterLink(backRouterNavigate: string) {
    this.navButtonsService.setBackRouterLink(backRouterNavigate);
  }

  public backClicked() {
    this.navButtonsService.backClicked();
  }

  public navButtonClicked(buttonId: string) {
    this.navButtonsService.navButtonClicked(buttonId);
  }

  public setLanguage(lang: string) {
    if (lang === this.translateService.currentLang) {
      return;
    }
    this.translateService.use(lang);
    this.language$.next(lang);
    this.storageService.setItem('language', lang);
  }

  public applyStoredLanguage() {
    const languageFromStorage = this.storageService.getItem('language');
    const languageFromBrowser = this.translateService.getBrowserLang();
    if (languageFromStorage) {
      this.setLanguage(languageFromStorage);
    } else if (['en', 'fr'].includes(languageFromBrowser)) {
      this.setLanguage(languageFromBrowser);
    } else {
      this.setLanguage('fr');
    }
  }
}
