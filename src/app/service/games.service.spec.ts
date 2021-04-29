import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {ApiErrorModule} from '../api-error/api-error.module';
import {StorageModule} from '../storage/storage.module';
import {SocketTestingModule} from '../testing/socket-testing.module';
import {GamesService} from './games.service';

describe('GamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      SocketTestingModule,
      ApiErrorModule,
      StorageModule,
    ],
    providers: [
      GamesService,
    ]
  }));

  it('should be created', () => {
    const service: GamesService = TestBed.inject(GamesService);
    expect(service).toBeTruthy();
  });
});
