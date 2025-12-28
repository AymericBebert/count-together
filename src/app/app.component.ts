import {AsyncPipe, Location} from '@angular/common';
import {Component, inject, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ActivatedRoute, NavigationEnd, NavigationExtras, Router, RouterModule} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {filter, map, mergeMap} from 'rxjs/operators';
import {APP_CONFIG} from '../config/app.config';
import {IconCrownComponent} from './icons/icon-crown.component';
import {ChangeLanguageComponent} from './nav/change-language.component';
import {NavButtonsService} from './nav/nav-buttons.service';
import {NavService, NavTool} from './nav/nav.service';
import {DeviceService} from './service/device.service';
import {GameSettingsService} from './service/game-settings.service';
import {SettingsService} from './service/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    AsyncPipe,
    RouterModule,
    TranslateModule,
    IconCrownComponent,
    ChangeLanguageComponent,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
  ],
})
export class AppComponent {
  protected readonly gameSettingsService = inject(GameSettingsService);
  protected readonly navService = inject(NavService);
  protected readonly navButtonsService = inject(NavButtonsService);
  protected readonly settingsService = inject(SettingsService);
  protected readonly deviceService = inject(DeviceService);
  private readonly config = inject(APP_CONFIG);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  protected readonly appVersion = this.config.version;

  private readonly navDrawer = viewChild<MatSidenav | null>('drawer');

  constructor() {
    const translate = inject(TranslateService);

    translate.addLangs(['fr', 'en']);
    translate.setFallbackLang('fr');
    this.navService.applyStoredLanguage();
    this.navService.applyStoredPinSideNav();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => AppComponent.getRouteFarthestChild(this.route)),
        filter(r => r.outlet === 'primary'),
        mergeMap(r => r.data),
        takeUntilDestroyed(),
      )
      .subscribe(data => {
        this.navService.showBackButton.set(data.hasBack || !!data.backRouterNavigate);
        this.navService.navButtons.set(data.navButtons || []);
        this.navService.navTools.set(data.navTools || []);
        this.navService.mainTitle.set(data.mainTitle || '');
        this.navButtonsService.setBackRouterLink(data.backRouterNavigate);
      });

    this.route.queryParamMap
      .pipe(
        map(params => params.has('sidenav')),
        takeUntilDestroyed(),
      )
      .subscribe(qpOpen => {
        const navDrawer = this.navDrawer();
        if (!this.navService.pinSideNav() && navDrawer) {
          // If the sidenav should not be open, close it
          if (navDrawer.opened && !qpOpen) {
            void navDrawer.close();
          }
          // If there is the sidenav query param but the sidenav is not open, remove the query param
          if (!navDrawer.opened && qpOpen) {
            void this.router.navigate([], this.removeSidenavQueryParam);
          }
        }
      });
  }

  protected openDrawer(): void {
    const navDrawer = this.navDrawer();
    if (navDrawer) {
      if (!this.deviceService.isHandset()) {
        this.navService.setPinSideNav(true);
      }
      if (!this.navService.pinSideNav()) {
        void this.router.navigate([], this.addSidenavQueryParam);
      }
      void navDrawer.open();
    }
  }

  protected closeDrawer(): void {
    if (this.navDrawer()?.opened && !this.navService.pinSideNav()) {
      this.location.back();
    }
  }

  protected drawerToolClicked(tool: NavTool): void {
    this.navButtonsService.navButtonClicked(
      tool.name,
      this.navService.pinSideNav() ? undefined : this.removeSidenavQueryParam,
    );
  }

  private get addSidenavQueryParam(): NavigationExtras {
    return {queryParams: {sidenav: true}, queryParamsHandling: 'merge'};
  }

  private get removeSidenavQueryParam(): NavigationExtras {
    return {replaceUrl: true, queryParams: {sidenav: null}, queryParamsHandling: 'merge'};
  }

  private static getRouteFarthestChild(initialRoute: ActivatedRoute): ActivatedRoute {
    let route = initialRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
