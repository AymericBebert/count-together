/// <reference types="@types/dom-mediacapture-record" />
import {inject, Injectable, InjectionToken, OnDestroy, signal} from '@angular/core';
import {BehaviorSubject, from, Observable, of, OperatorFunction, Subject} from 'rxjs';
import {catchError, filter, first, take, tap, timeout} from 'rxjs/operators';
import {BrowserCompatibilityService} from './browser-compatibility.service';

export interface RecorderConfig {
  audioOnly: boolean;
  maxDurationMs: number | null;
}

export type RecorderStatus = 'error' | 'notStarted' | 'awaitingAuthorization' | 'ready' | 'recording';

export const DEFAULT_AUDIO_CONFIG = {
  sampleRate: {
    min: 22000,
    ideal: 44000,
  },
};

export const DEFAULT_VIDEO_CONFIG = {
  facingMode: 'user',
  width: {min: 640, ideal: 1280, max: 1920},
  height: {min: 360, ideal: 720, max: 1080},
};

export const RECORDER_CONFIG = new InjectionToken<Partial<RecorderConfig>>('recorder_config');

@Injectable()
export class RecordService implements OnDestroy {
  private readonly recorderConfig = inject<Partial<RecorderConfig> | null>(RECORDER_CONFIG, {optional: true});
  private readonly browserCompatibilityService = inject(BrowserCompatibilityService);

  public readonly error = signal<string>('');
  public readonly status = signal<RecorderStatus>('notStarted');
  public readonly recordProgress$ = new BehaviorSubject<number>(0);
  public readonly record$ = new Subject<Blob>();
  public readonly stream$ = new BehaviorSubject<MediaStream | null>(null);

  private recordStartTimestamp?: number;
  private mediaRecorder?: MediaRecorder;
  private recordChunks: Blob[] = [];
  private readonly recordEnd$ = new Subject<void>();
  private readonly chunkDurationMs = 100;
  private readonly config: RecorderConfig = {
    audioOnly: false,
    maxDurationMs: null,
  };

  constructor() {
    const recorderConfig = this.recorderConfig;

    if (recorderConfig) {
      this.config = {...this.config, ...recorderConfig};
    }

    if (!this.browserCompatibilityService.isBrowserSupported()) {
      this.status.set('error');
      this.error.set('NotSupportedError');
      return;
    }
  }

  ngOnDestroy(): void {
    this.stopStream();
  }

  public askUserPermission$(): Observable<MediaStream | null> {
    if (this.status() === 'notStarted') {
      this.status.set('awaitingAuthorization');
    }
    return this.getOrCreateStream$()
      .pipe(
        filter(stream => !!stream),
        tap(() => this.status.set('ready')),
        first(),
      );
  }

  public startRecording$(): Observable<MediaStream | null> {
    this.recordStartTimestamp = undefined;
    this.recordProgress$.next(0);
    return this.askUserPermission$()
      .pipe(
        tap(() => this.mediaRecorder?.start(this.chunkDurationMs)),
      );
  }

  public stopRecording(): void {
    this.recordEnd$.next();
  }

  public stopStream(): void {
    const stream = this.stream$.getValue();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      this.stream$.next(null);
      this.status.set('notStarted');
    }
  }

  private getOrCreateStream$(): Observable<MediaStream | null> {
    if (this.stream$.getValue()) {
      return this.stream$;
    }
    const options: MediaStreamConstraints = {
      audio: DEFAULT_AUDIO_CONFIG,
    };
    if (!this.config.audioOnly) {
      options.video = DEFAULT_VIDEO_CONFIG;
    }
    const mediaDevices = navigator.mediaDevices;

    if (!mediaDevices) {
      this.status.set('error');
      this.error.set('NotFoundError');
      console.error('No media devices');
      return of(null);
    }
    return from(mediaDevices.getUserMedia(options))
      .pipe(
        filter(stream => this.config.audioOnly ? !!stream.getAudioTracks().length : !!stream.getVideoTracks().length),
        take(1),
        tap(stream => {
          this.stream$.next(stream);
          this.mediaRecorder = this.getMediaRecorder(stream);
        }),
        catchError(err => {
          this.status.set('error');
          if (['NotAllowedError', 'NotFoundError'].includes(err.name)) {
            this.error.set(err.name);
          } else {
            this.error.set('UnknownError');
            console.error(err);
          }
          return of(null);
        }),
      );
  }

  private getMediaRecorder(stream: MediaStream): MediaRecorder {
    const options: MediaRecorderOptions = {};
    if (this.config.audioOnly) {
      options.mimeType = this.browserCompatibilityService.getBestAudioMimeType();
    } else {
      options.mimeType = this.browserCompatibilityService.getBestVideoMimeType();
    }
    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.onstart = () => this.onRecordStart();
    mediaRecorder.ondataavailable = (chunk) => {
      if (!this.recordStartTimestamp) {
        this.recordStartTimestamp = chunk.timeStamp - this.chunkDurationMs;
      }
      if (this.config.maxDurationMs) {
        this.recordProgress$.next((chunk.timeStamp - this.recordStartTimestamp) / this.config.maxDurationMs);
      }
      this.recordChunks.push(chunk.data);
    };
    mediaRecorder.onstop = () => this.onRecordStop();
    return mediaRecorder;
  }

  private onRecordStart(): void {
    this.recordChunks = [];
    this.status.set('recording');
    if (!this.stream$.getValue()) {
      console.error('Stream not available');
      return;
    }

    this.recordEnd$
      .pipe(
        take(1),
        this.conditionalTimeout(this.config.maxDurationMs),
        catchError(() => of([])),
      )
      .subscribe(() => {
        if (this.mediaRecorder) {
          this.mediaRecorder.stop();
        }
      });
  }

  private conditionalTimeout<T>(value: number | null): OperatorFunction<T, T> {
    return (source: Observable<T>): Observable<T> => value ? source.pipe(timeout(value)) : source;
  }

  private onRecordStop(): void {
    if (this.status() !== 'recording') {
      return;
    }
    const options: BlobPropertyBag = {};
    if (this.config.audioOnly) {
      options.type = this.browserCompatibilityService.getBestAudioMimeType();
    } else {
      options.type = this.browserCompatibilityService.getBestVideoMimeType();
    }
    this.record$.next(new Blob(this.recordChunks, options));
    this.status.set('ready');
    console.log('recordChunks:', this.recordChunks);
  }
}
