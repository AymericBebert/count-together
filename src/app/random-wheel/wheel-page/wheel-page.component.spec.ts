import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatSliderModule} from '@angular/material/slider';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {EMPTY} from 'rxjs';
import {SettingsService} from '../../service/settings.service';
import {translateTestingModule} from '../../testing/translate-testing-module';
import {WheelComponent} from '../wheel/wheel.component';
import {WheelPageComponent} from './wheel-page.component';

describe('WheelPageComponent', () => {
  let component: WheelPageComponent;
  let fixture: ComponentFixture<WheelPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        WheelPageComponent,
        WheelComponent,
      ],
      imports: [
        translateTestingModule,
        RouterTestingModule,
        MatSliderModule,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {queryParams: EMPTY}},
        SettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WheelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
