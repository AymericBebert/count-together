import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {ApiErrorService} from '../api-error/api-error.service';
import {SocketService} from '../socket/socket.service';
import {StorageService} from '../storage/storage.service';
import {GameSettingsService} from './game-settings.service';
import {GamesService} from './games.service';

describe('GameSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      MatSnackBarModule,
    ],
    providers: [
      GameSettingsService,
      GamesService,
      ApiErrorService,
      SocketService,
      StorageService,
    ],
  }));

  it('should be created', () => {
    const service: GameSettingsService = TestBed.inject(GameSettingsService);
    expect(service).toBeTruthy();
  });
});
