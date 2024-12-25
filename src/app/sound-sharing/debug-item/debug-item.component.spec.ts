import {provideExperimentalZonelessChangeDetection} from '@angular/core';
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
      providers: [
        provideExperimentalZonelessChangeDetection(),
      ],
    })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(DebugItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOk', true);
    fixture.componentRef.setInput('label', 'Test');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
