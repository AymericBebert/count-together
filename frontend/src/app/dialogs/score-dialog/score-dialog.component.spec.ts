import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {translateTestingModule} from '../../testing/translate-testing-module';
import {ScoreDialogComponent, ScoreDialogData} from './score-dialog.component';

describe('ScoreDialogComponent', () => {
  let component: ScoreDialogComponent;
  let fixture: ComponentFixture<ScoreDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        ScoreDialogComponent,
        translateTestingModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: MatDialogRef, useValue: {close: () => void 0}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            label: 'Test label',
          } satisfies ScoreDialogData,
        },
      ],
    });

    fixture = TestBed.createComponent(ScoreDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
