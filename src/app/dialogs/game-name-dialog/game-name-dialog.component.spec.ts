import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {translateTestingModule} from '../../testing/translate-testing-module';
import {GameNameDialogComponent} from './game-name-dialog.component';

describe('GameNameDialogComponent', () => {
  let component: GameNameDialogComponent;
  let fixture: ComponentFixture<GameNameDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        translateTestingModule,
        GameNameDialogComponent,
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
