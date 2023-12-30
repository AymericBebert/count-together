import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {ScoreDialogComponent} from './score-dialog.component';

describe('ScoreDialogComponent', () => {
  let component: ScoreDialogComponent;
  let fixture: ComponentFixture<ScoreDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ScoreDialogComponent,
        HttpClientTestingModule,
        TranslateTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: {close: () => void 0}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            editGame: true,
          },
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
