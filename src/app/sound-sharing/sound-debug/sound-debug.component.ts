import {NgIf} from '@angular/common';
import {Component, ElementRef, inject, OnDestroy, OnInit, viewChild} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {DebugItemComponent} from '../debug-item/debug-item.component';
import {RECORDER_CONFIG, RecordService} from '../record.service';
import {SoundSharingService} from '../sound-sharing.service';

@Component({
  selector: 'app-sound-sharing',
  templateUrl: './sound-debug.component.html',
  styleUrls: ['./sound-debug.component.scss'],
  providers: [
    SoundSharingService,
    RecordService,
    {provide: RECORDER_CONFIG, useValue: {audioOnly: true}},
  ],
  imports: [
    NgIf,
    DebugItemComponent,
    MatIcon,
    TranslateModule,
    MatButton,
  ],
})
export class SoundDebugComponent implements OnInit, OnDestroy {
  public readonly recordService = inject(RecordService);

  readonly replayAudioElement = viewChild.required<ElementRef<HTMLAudioElement>>('replayAudio');
  public replayAvailable = false;
  // public micPermission: PermissionState | null = null;
  public mediaDevices = navigator.mediaDevices;
  public userMedia = navigator.mediaDevices?.getUserMedia({audio: true});
  public mediaRecorderType = typeof MediaRecorder;

  private readonly destroy$ = new Subject<void>();
  private recordBlob: Blob | undefined = undefined;

  ngOnInit(): void {
    this.recordService.record$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(recordBlob => {
        this.recordBlob = recordBlob;
        this.replayAudioElement().nativeElement.src = URL.createObjectURL(recordBlob);
        this.replayAvailable = true;
      });

    // this.askUserPermission();
    // this.checkMicAccessPermission();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  // private checkMicAccessPermission() {
  //   navigator.permissions.query({name: 'microphone'}).then(result => {
  //     this.micPermission = result.state;
  //     console.log('mic permission', result.state);
  //     result.onchange = this.checkMicAccessPermission.bind(this);
  //   });
  // }
}
