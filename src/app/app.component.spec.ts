import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute} from '@angular/router';
import {AppComponent} from './app.component';
import {ConfigTestingModule} from './testing/config-testing.module';
import {TranslateTestingModule} from './testing/translate-testing-module';
import {UpdaterTestingModule} from './testing/updater-testing.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateTestingModule,
        HttpClientTestingModule,
        UpdaterTestingModule,
        ConfigTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {outlet: 'primary', data: {}}},
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
