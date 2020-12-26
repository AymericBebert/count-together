import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ScoreDialogComponent} from './score-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('ScoreDialogComponent', () => {
  let component: ScoreDialogComponent;
  let fixture: ComponentFixture<ScoreDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule,
        MatListModule,
        MatDialogModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [
        ScoreDialogComponent,
      ],
      providers: [
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
