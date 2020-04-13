import {TestBed} from '@angular/core/testing';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {GamesService} from './games.service';
import {ApiErrorModule} from '../api-error/api-error.module';
import {SocketTestingModule} from '../testing/socket-testing.module';

describe('GamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      SocketTestingModule,
      ApiErrorModule,
    ],
    providers: [
      GamesService,
    ]
  }));

  it('should be created', () => {
    const service: GamesService = TestBed.get(GamesService);
    expect(service).toBeTruthy();
  });
});