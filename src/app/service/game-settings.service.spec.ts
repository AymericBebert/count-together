import {TestBed} from '@angular/core/testing';
import {GameSettingsService} from './game-settings.service';

describe('GameSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      GameSettingsService,
    ],
  }));

  it('should be created', () => {
    const service: GameSettingsService = TestBed.inject(GameSettingsService);
    expect(service).toBeTruthy();
  });
});
