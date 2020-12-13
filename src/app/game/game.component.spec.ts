import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
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
import {NavButtonsService} from '../service/nav-buttons.service';
import {GamesService} from '../service/games.service';
import {ApiErrorModule} from '../api-error/api-error.module';
import {StorageModule} from '../storage/storage.module';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule,
        RouterTestingModule,
        SocketTestingModule,
        ShareButtonModule,
        MatIconModule,
        MatDialogModule,
        ApiErrorModule,
        StorageModule,
      ],
      declarations: [
        GameComponent,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
        GamesService,
        NavButtonsService,
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
