import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {WheelPageComponent} from './wheel-page.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {ActivatedRoute} from '@angular/router';
import {EMPTY} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {SettingsService} from '../../service/settings.service';
import {MatSliderModule} from '@angular/material/slider';
import {WheelComponent} from '../wheel/wheel.component';

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
