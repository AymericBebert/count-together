import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {EMPTY} from 'rxjs';
import {ApiErrorModule} from '../api-error/api-error.module';
import {GameSettingsService} from '../service/game-settings.service';
import {GamesService} from '../service/games.service';
import {NavButtonsService} from '../service/nav-buttons.service';
import {ShareButtonModule} from '../share-button/share-button.module';
import {StorageModule} from '../storage/storage.module';
import {SocketTestingModule} from '../testing/socket-testing.module';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {GameComponent} from './game.component';

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
        GameSettingsService,
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
