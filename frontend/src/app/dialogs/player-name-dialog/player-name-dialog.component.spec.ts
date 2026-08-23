import {provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {translateTestingModule} from '../../testing/translate-testing-module';
import {PlayerNameDialogComponent, PlayerNameDialogData} from './player-name-dialog.component';

describe('PlayerNameDialogComponent', () => {
  let component: PlayerNameDialogComponent;
  let fixture: ComponentFixture<PlayerNameDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        PlayerNameDialogComponent,
        translateTestingModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: MatDialogRef, useValue: {close: () => void 0}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            name: 'Player 1',
            isNew: false,
          } satisfies PlayerNameDialogData,
        },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(PlayerNameDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
