import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {EMPTY} from 'rxjs';
import {translateTestingModule} from '../../testing/translate-testing-module';
import {WheelComponent} from './wheel.component';

describe('WheelComponent', () => {
  let component: WheelComponent;
  let fixture: ComponentFixture<WheelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        WheelComponent,
      ],
      imports: [
        translateTestingModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
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
