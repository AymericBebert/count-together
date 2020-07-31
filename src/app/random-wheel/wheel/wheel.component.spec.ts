import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WheelComponent} from './wheel.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {ActivatedRoute} from '@angular/router';
import {EMPTY} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('WheelComponent', () => {
  let component: WheelComponent;
  let fixture: ComponentFixture<WheelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule,
        RouterTestingModule,
      ],
      declarations: [
        WheelComponent,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
