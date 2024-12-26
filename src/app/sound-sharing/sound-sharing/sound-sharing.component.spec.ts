import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {EMPTY} from 'rxjs';
import {translateTestingModule} from '../../testing/translate-testing-module';

import {SoundSharingComponent} from './sound-sharing.component';

describe('SoundSharingComponent', () => {
  let component: SoundSharingComponent;
  let fixture: ComponentFixture<SoundSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SoundSharingComponent,
        translateTestingModule,
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {provide: ActivatedRoute, useValue: {parent: {paramMap: EMPTY}}},
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
