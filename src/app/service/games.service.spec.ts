import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {ConfigTestingModule} from '../testing/config-testing.module';
import {SocketTestingModule} from '../testing/socket-testing.module';
import {GamesService} from './games.service';

describe('GamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      SocketTestingModule,
      ConfigTestingModule,
    ],
    providers: [
      GamesService,
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
    ],
  }));

  it('should be created', () => {
    const service: GamesService = TestBed.inject(GamesService);
    expect(service).toBeTruthy();
  });
});
