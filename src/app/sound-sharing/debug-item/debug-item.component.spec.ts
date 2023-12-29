import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugItemComponent} from './debug-item.component';

describe('DebugItemComponent', () => {
  let component: DebugItemComponent;
  let fixture: ComponentFixture<DebugItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DebugItemComponent,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
