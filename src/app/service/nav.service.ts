import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, from} from 'rxjs';
import {filter, switchMap, tap} from 'rxjs/operators';
import {StorageService} from '../storage/storage.service';
import {UpdaterService} from '../updater/updater.service';
import {DeviceService} from './device.service';
import {NavButtonsService} from './nav-buttons.service';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public mainTitle$ = new BehaviorSubject<string>('');
  public pinSideNav$ = new BehaviorSubject<boolean>(false);
  public showBackButton$ = new BehaviorSubject<boolean>(false);
  public navButtons$ = new BehaviorSubject<string[]>([]);
  public navTools$ = new BehaviorSubject<{ name: string, icon: string }[]>([]);

  public notificationBadge = '';
  public displayUpdatesAvailable = false;
  public displayUpdatesActivated = false;

  public language$ = new BehaviorSubject<string>('');

  constructor(private navButtonsService: NavButtonsService,
              private settingsService: SettingsService,
              private deviceService: DeviceService,
              private translateService: TranslateService,
              private storageService: StorageService,
              private updater: UpdaterService,
  ) {
    this.deviceService.isHandset$.pipe(filter(h => h)).subscribe(() => this.setPinSideNav(false));

    this.updater.updatesAvailable$.pipe(filter(a => a)).subscribe(() => {
      this.notificationBadge = '1';
      this.displayUpdatesAvailable = true;
    });

    this.updater.updatesActivated$.pipe(filter(a => a)).subscribe(() => {
      this.notificationBadge = '1';
      this.displayUpdatesActivated = true;
    });
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

  public navToolClicked(toolId: string) {
    this.navButtonsService.navButtonClicked(toolId);
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
    } else if (languageFromBrowser && ['en', 'fr'].includes(languageFromBrowser)) {
      this.setLanguage(languageFromBrowser);
    } else {
      this.setLanguage('fr');
    }
  }

  public setDarkMode(b: boolean) {
    this.storageService.setItem('darkMode', JSON.stringify(b));
    this.settingsService.darkMode = b;
  }

  public applyStoredDarkMode() {
    const darkModeFromStorage = this.storageService.getItem('darkMode');
    if (darkModeFromStorage && JSON.parse(darkModeFromStorage)) {
      this.setDarkMode(true);
    }
  }

  public setPinSideNav(b: boolean) {
    this.storageService.setItem('pinSideNav', JSON.stringify(b));
    this.pinSideNav$.next(b);
  }

  public applyPinSideNav() {
    const pinSideNavFromStorage = this.storageService.getItem('pinSideNav');
    if (pinSideNavFromStorage && JSON.parse(pinSideNavFromStorage)) {
      this.setPinSideNav(true);
    }
  }

  public update() {
    this.updater.update();
  }

  public checkForUpdates() {
    console.log('checkForUpdates clicked');
    this.clearRefreshPage(false);
  }

  public clearRefreshPage(alwaysRefresh: boolean = true) {
    console.log('checkForUpdates clicked');
    from(window.caches.keys())
      .pipe(
        tap(keys => console.log('Cache keys:', keys)),
        filter(keys => alwaysRefresh || keys.length > 0),
        switchMap(keys => Promise.all(keys.map(key => caches.delete(key)))),
        tap(deleted => console.log('Deleted?:', deleted)),
        filter(deleted => alwaysRefresh || deleted.some(d => d)),
      )
      .subscribe(() => this.refreshPage());
  }

  public refreshPage() {
    console.log('Refreshing page...');
    location.reload();
  }
}
