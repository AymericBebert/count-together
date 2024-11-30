import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {EMPTY} from 'rxjs';
import {translateTestingModule} from '../../testing/translate-testing-module';
import {WheelPageComponent} from './wheel-page.component';

describe('WheelPageComponent', () => {
  let component: WheelPageComponent;
  let fixture: ComponentFixture<WheelPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        translateTestingModule,
        RouterTestingModule,
        WheelPageComponent,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {queryParams: EMPTY}},
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
