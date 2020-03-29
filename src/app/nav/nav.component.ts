import {Component, ViewChild} from '@angular/core';
import {filter, map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NavService} from '../service/nav.service';
import {environment} from '../../environments/environment';
import {SettingsService} from '../service/settings.service';
import {DeviceService} from '../service/device.service';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  @ViewChild('drawer', {static: true}) public navDrawer: MatSidenav;

  public appVersion = environment.appVersion;

  constructor(public navService: NavService,
              public settingsService: SettingsService,
              public deviceService: DeviceService,
              private route: ActivatedRoute,
              private router: Router,
  ) {
    this.router.events
      .pipe(
        filter(val => val instanceof NavigationEnd),
        map(() => route),
        map(r => {
          while (r.firstChild) {
            r = r.firstChild;
          }
          return r;
        }),
        filter(r => r.outlet === 'primary'),
        mergeMap(r => r.data)
      )
      .subscribe(data => {
        this.navService.showBackButton$.next(data.hasBack || !!data.backRouterNavigate);
        this.navService.navButtons$.next(data.navButtons || []);
        // this.navService.mainTitle$.next(data.mainTitle || '');
        this.navService.setBackRouterLink(data.backRouterNavigate);
      });
  }

  public closeDrawer(): void {
    if (this.deviceService.isHandset$.getValue()) {
      this.navDrawer.close().catch(err => console.error('Could not close drawer?', err));
    }
  }
}
