import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {BrowserCompatibilityService} from '../browser-compatibility.service';
import {DebugItemModule} from '../debug-item/debug-item.module';

import {SoundDebugComponent} from './sound-debug.component';

describe('SoundDebugComponent', () => {
  let component: SoundDebugComponent;
  let fixture: ComponentFixture<SoundDebugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        DebugItemModule,
      ],
      declarations: [
        SoundDebugComponent,
      ],
      providers: [
        BrowserCompatibilityService,
      ],
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
