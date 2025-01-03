import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {firstValueFrom, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
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
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
    MatIcon,
    MatButton,
  ],
})
export class SoundSharingComponent {
  public readonly soundSharing = inject(SoundSharingService);
  private readonly recordService = inject(RecordService);
  private readonly route = inject(ActivatedRoute);

  public readonly gameShareData$: Observable<{ gameId: string; gamePayload: string } | null> = this.route.parent
    ? this.route.parent.paramMap.pipe(map(params => {
      const gameId = params.get('gameId');
      return gameId
        ? {gameId, gamePayload: SoundSharingService.cutChar(SoundSharingService.stringToDtmf(gameId))}
        : null;
    }))
    : of(null);

  shareSound(payload: string) {
    this.soundSharing.soundShare(payload).then(() => console.log('shared')).catch(() => console.log('error'));
  }

  async analyse(): Promise<void> {
    await this.askUserPermission();
    this.soundSharing.soundAnalyse();
  }

  stopAnalysing(): void {
    this.soundSharing.stopAnalysing();
  }

  private askUserPermission(): Promise<MediaStream | null> {
    return firstValueFrom(this.recordService.askUserPermission$());
  }
}
