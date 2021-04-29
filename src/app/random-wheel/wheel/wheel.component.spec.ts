import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {EMPTY} from 'rxjs';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {WheelComponent} from './wheel.component';

describe('WheelComponent', () => {
  let component: WheelComponent;
  let fixture: ComponentFixture<WheelComponent>;

  beforeEach(waitForAsync(() => {
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
