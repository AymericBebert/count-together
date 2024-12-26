import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RankIconComponent} from './rank-icon.component';

describe('RankIconComponent', () => {
  let component: RankIconComponent;
  let fixture: ComponentFixture<RankIconComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RankIconComponent,
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(RankIconComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
