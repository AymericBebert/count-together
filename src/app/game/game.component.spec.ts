import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GameComponent} from './game.component';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {MatDialogModule} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {EMPTY} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {ShareButtonModule} from '../share-button/share-button.module';
import {SocketTestingModule} from '../testing/socket-testing.module';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule,
        RouterTestingModule,
        SocketTestingModule,
        ShareButtonModule,
        MatIconModule,
        MatDialogModule,
      ],
      declarations: [
        GameComponent,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
