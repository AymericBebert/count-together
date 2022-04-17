import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {RECORDER_CONFIG, RecordService} from '../record.service';
import {SoundSharingService} from '../sound-sharing.service';

@Component({
  selector: 'app-sound-sharing',
  templateUrl: './sound-sharing.component.html',
  styleUrls: ['./sound-sharing.component.scss'],
  providers: [
    SoundSharingService,
    RecordService,
    {provide: RECORDER_CONFIG, useValue: {audioOnly: true}},
  ],
})
export class SoundSharingComponent {
  public gameShareData$: Observable<{ gameId: string; gamePayload: string } | null> = this.route.parent.paramMap.pipe(
    map(params => {
      const gameId = params.get('gameId');
      return gameId ? {gameId, gamePayload: SoundSharingService.cutBytes(SoundSharingService.stringToBinary(gameId))} : null;
    }),
  );

  private frequencyDiff = this.soundSharing.FFT_INDEX_1 - this.soundSharing.FFT_INDEX_0;
  public analyseRange = Array(Math.round(this.frequencyDiff * 3 / 2)).fill(0)
    .map((x, i) => i + Math.round(this.soundSharing.FFT_INDEX_0 - this.frequencyDiff / 4));

  constructor(public readonly soundSharing: SoundSharingService,
              private readonly recordService: RecordService,
              private route: ActivatedRoute,
  ) {
  }

  shareSound(payload: string) {
    this.soundSharing.soundShare(payload).then(() => console.log('shared')).catch(() => console.log('error'));
  }

  async analyse(): Promise<void> {
    await this.askUserPermission();

    this.soundSharing.soundAnalyse().then(() => console.log('analysed')).catch(() => console.log('error'));
  }

  stopAnalysing(): void {
    this.soundSharing.stopAnalysing();
  }

  private askUserPermission(): Promise<MediaStream | null> {
    return this.recordService.askUserPermission$().pipe(first(null, null)).toPromise();
  }
}
