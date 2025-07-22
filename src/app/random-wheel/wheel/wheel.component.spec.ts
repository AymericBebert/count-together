import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {EMPTY} from 'rxjs';
import {translateTestingModule} from '../../testing/translate-testing-module';
import {WheelComponent} from './wheel.component';

describe('WheelComponent', () => {
  let component: WheelComponent;
  let fixture: ComponentFixture<WheelComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        translateTestingModule,
        RouterTestingModule,
        WheelComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(WheelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
