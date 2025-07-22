import {Component, DestroyRef, ElementRef, inject, OnInit, signal, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {first} from 'rxjs/operators';
import {DebugItemComponent} from '../debug-item/debug-item.component';
import {RECORDER_CONFIG, RecordService} from '../record.service';

@Component({
  selector: 'app-sound-sharing',
  templateUrl: './sound-debug.component.html',
  styleUrls: ['./sound-debug.component.scss'],
  providers: [
    RecordService,
    {provide: RECORDER_CONFIG, useValue: {audioOnly: true}},
  ],
  imports: [
    DebugItemComponent,
    MatIcon,
    TranslateModule,
    MatButton,
  ],
})
export class SoundDebugComponent implements OnInit {
  public readonly recordService = inject(RecordService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly replayAudioElement = viewChild.required<ElementRef<HTMLAudioElement>>('replayAudio');
  public readonly replayAvailable = signal<boolean>(false);
  // public micPermission: PermissionState | null = null;
  public readonly mediaDevices = navigator.mediaDevices;
  public readonly userMedia = navigator.mediaDevices?.getUserMedia({audio: true});
  public readonly mediaRecorderType = typeof MediaRecorder;

  private recordBlob: Blob | undefined = undefined;

  ngOnInit(): void {
    this.recordService.record$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(recordBlob => {
        this.recordBlob = recordBlob;
        this.replayAudioElement().nativeElement.src = URL.createObjectURL(recordBlob);
        this.replayAvailable.set(true);
      });

    // this.askUserPermission();
    // this.checkMicAccessPermission();
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
