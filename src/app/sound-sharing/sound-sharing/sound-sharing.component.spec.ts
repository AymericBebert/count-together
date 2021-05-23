import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {TranslateTestingModule} from '../../testing/translate-testing-module';
import {BrowserCompatibilityService} from '../browser-compatibility.service';

import {SoundSharingComponent} from './sound-sharing.component';

describe('SoundSharingComponent', () => {
  let component: SoundSharingComponent;
  let fixture: ComponentFixture<SoundSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        MatIconModule,
      ],
      declarations: [
        SoundSharingComponent,
      ],
      providers: [
        BrowserCompatibilityService,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
