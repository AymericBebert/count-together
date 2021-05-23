import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
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
export class SoundSharingComponent implements OnInit, OnDestroy {
  @ViewChild('replayAudio') replayAudioElement: ElementRef<HTMLAudioElement>;
  public replayAvailable = false;
  public micPermission: PermissionState | null = null;

  private frequencyDiff = this.soundSharing.FFT_INDEX_1 - this.soundSharing.FFT_INDEX_0;
  public analyseRange = Array(Math.round(this.frequencyDiff * 1.6)).fill(0)
    .map((x, i) => i + Math.round(this.soundSharing.FFT_INDEX_0 - this.frequencyDiff / 3));

  private destroy$ = new Subject<void>();
  private recordBlob: Blob | undefined = undefined;

  constructor(public readonly recordService: RecordService,
              public readonly soundSharing: SoundSharingService,
  ) {
  }

  ngOnInit(): void {
    this.recordService.record$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(recordBlob => {
        this.recordBlob = recordBlob;
        this.replayAudioElement.nativeElement.src = URL.createObjectURL(recordBlob);
        this.replayAvailable = true;
      });

    this.askUserPermission();
    this.checkMicAccessPermission();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  shareSound() {
    this.soundSharing.soundShare('test').then(() => console.log('shared')).catch(() => console.log('error'));
  }

  // listenSharedSound() {
  //   this.soundSharing.soundListen().then(() => console.log('listened')).catch(() => console.log('error'));
  // }

  analyse(): void {
    this.soundSharing.soundAnalyse().then(() => console.log('analysed')).catch(() => console.log('error'));
  }

  stopAnalysing(): void {
    this.soundSharing.stopAnalysing();
  }

  useRecord(): void {
    // if (this.recordBlob) {
    //   this.recordUploadService.uploadRecord(this.recordBlob).subscribe();
    // }
    console.log(this.recordBlob);
    this.soundSharing.soundAnalyse().then(() => console.log('analysed')).catch(() => console.log('error'));
  }

  askUserPermission(): void {
    this.recordService.askUserPermission$().pipe(first(null, null)).subscribe();
  }

  startRecording(): void {
    this.recordService.startRecording$().pipe(first(null, null)).subscribe();
  }

  stopRecording(): void {
    this.recordService.stopRecording();
  }

  stopStream(): void {
    this.recordService.stopStream();
  }

  private checkMicAccessPermission() {
    navigator.permissions.query({name: 'microphone'}).then(result => {
      this.micPermission = result.state;
      console.log('mic permission:', result.state);
      result.onchange = this.checkMicAccessPermission.bind(this);
    });
  }
}
