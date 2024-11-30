import {ComponentFixture, TestBed} from '@angular/core/testing';
import {translateTestingModule} from '../../testing/translate-testing-module';
import {SoundDebugComponent} from './sound-debug.component';

describe('SoundDebugComponent', () => {
  let component: SoundDebugComponent;
  let fixture: ComponentFixture<SoundDebugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SoundDebugComponent,
        translateTestingModule,
      ],
      providers: [],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
