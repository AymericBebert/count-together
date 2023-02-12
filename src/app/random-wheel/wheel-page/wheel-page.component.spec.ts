import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatLegacySliderModule as MatSliderModule} from '@angular/material/legacy-slider';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {EMPTY} from 'rxjs';
import {SettingsService} from '../../service/settings.service';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {WheelComponent} from '../wheel/wheel.component';
import {WheelPageComponent} from './wheel-page.component';

describe('WheelPageComponent', () => {
  let component: WheelPageComponent;
  let fixture: ComponentFixture<WheelPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule,
        RouterTestingModule,
        MatSliderModule,
      ],
      declarations: [
        WheelPageComponent,
        WheelComponent,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {queryParams: EMPTY}},
        SettingsService,
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
