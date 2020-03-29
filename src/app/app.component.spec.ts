import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateTestingModule} from './testing/translate-testing-module';
import {NavComponent} from './nav/nav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ChangeLanguageComponent} from './nav/change-language.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
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
        MatMenuModule,
        NoopAnimationsModule,
      ],
      declarations: [
        AppComponent,
        NavComponent,
        ChangeLanguageComponent,
      ],
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
