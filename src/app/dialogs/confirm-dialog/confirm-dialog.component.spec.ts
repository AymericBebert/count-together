import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {ConfirmDialogComponent} from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatButtonModule,
      ],
      declarations: [
        ConfirmDialogComponent,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'test',
            message: 'test',
            confirm: 'test',
            dismiss: 'test',
          },
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
