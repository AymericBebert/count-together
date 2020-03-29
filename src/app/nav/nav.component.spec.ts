import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NavComponent} from './nav.component';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {RouterTestingModule} from '@angular/router/testing';
import {DeviceService} from '../service/device.service';
import {ChangeLanguageComponent} from './change-language.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavComponent,
        ChangeLanguageComponent,
      ],
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatSlideToggleModule,
        MatIconModule,
        MatMenuModule,
      ],
      providers: [
        CookieService,
        DeviceService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
