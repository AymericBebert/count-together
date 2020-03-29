import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav.component';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {AuthService} from '../auth/auth.service';
import {AuthTestingService} from '../testing/auth-testing.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {RouterTestingModule} from '@angular/router/testing';
import {DeviceService} from '../service/device.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomMaterialModule} from '../material/custom-material.module';
import {MatListModule} from '@angular/material';
import {ChangeLanguageComponent} from './change-language.component';

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
        FormsModule,
        ReactiveFormsModule,
        TranslateTestingModule,
        NoopAnimationsModule,
        LayoutModule,
        CustomMaterialModule,
        MatListModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: AuthService, useClass: AuthTestingService},
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
