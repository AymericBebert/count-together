import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiErrorService} from './api-error/api-error.service';
import {AppComponent} from './app.component';
import {ChangeLanguageComponent} from './nav/change-language.component';
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
