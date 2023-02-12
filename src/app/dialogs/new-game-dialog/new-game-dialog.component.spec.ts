import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {NewGameDialogComponent} from './new-game-dialog.component';

describe('NewGameDialogComponent', () => {
  let component: NewGameDialogComponent;
  let fixture: ComponentFixture<NewGameDialogComponent>;

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
        MatSelectModule,
        MatCheckboxModule,
      ],
      declarations: [
        NewGameDialogComponent,
      ],
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
