import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiErrorService} from './api-error/api-error.service';
import {AppComponent} from './app.component';
import {ChangeLanguageComponent} from './nav/change-language.component';
import {NavComponent} from './nav/nav.component';
import {DeviceService} from './service/device.service';
import {GameSettingsService} from './service/game-settings.service';
import {GamesService} from './service/games.service';
import {NavButtonsService} from './service/nav-buttons.service';
import {NavService} from './service/nav.service';
import {SettingsService} from './service/settings.service';
import {SocketService} from './socket/socket.service';
import {StorageModule} from './storage/storage.module';
import {TranslateTestingModule} from './testing/translate-testing-module';
import {UpdaterTestingModule} from './testing/updater-testing.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule,
        RouterTestingModule,
        MatSidenavModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatSlideToggleModule,
        MatIconModule,
        MatBadgeModule,
        MatMenuModule,
        NoopAnimationsModule,
        StorageModule,
        UpdaterTestingModule,
        MatSnackBarModule,
      ],
      declarations: [
        AppComponent,
        NavComponent,
        ChangeLanguageComponent,
      ],
      providers: [
        NavService,
        NavButtonsService,
        SettingsService,
        DeviceService,
        GameSettingsService,
        GamesService,
        ApiErrorService,
        SocketService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
