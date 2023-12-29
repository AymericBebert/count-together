import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ConfigTestingModule} from '../../testing/config-testing.module';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {NewGameDialogComponent} from './new-game-dialog.component';

describe('NewGameDialogComponent', () => {
  let component: NewGameDialogComponent;
  let fixture: ComponentFixture<NewGameDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NewGameDialogComponent,
        HttpClientTestingModule,
        TranslateTestingModule,
        ConfigTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            recentPlayers: [],
          },
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
