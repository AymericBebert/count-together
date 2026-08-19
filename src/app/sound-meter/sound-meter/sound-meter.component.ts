import {Component, computed, DestroyRef, inject, NgZone, OnDestroy, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {TranslatePipe} from '@ngx-translate/core';
import {StorageService} from '../../storage/storage.service';

type MeterStatus = 'idle' | 'starting' | 'running' | 'error';

const STORAGE_KEY_THRESHOLD = 'soundMeterThreshold';
const STORAGE_KEY_WINDOW_SIZE = 'soundMeterWindowSize';
const DEFAULT_THRESHOLD = 65;
const DEFAULT_WINDOW_SIZE = 24;

@Component({
  selector: 'app-sound-meter',
  templateUrl: './sound-meter.component.html',
  styleUrls: ['./sound-meter.component.scss'],
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class.over-threshold]': 'overThreshold()',
  },
  imports: [
    TranslatePipe,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
  ],
})
export class SoundMeterComponent implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly storageService = inject(StorageService);

  public readonly status = signal<MeterStatus>('idle');
  public readonly errorName = signal<string>('');
  public readonly volume = signal<number>(0);
  public readonly threshold = signal<number>(this.readStoredNumber(STORAGE_KEY_THRESHOLD, DEFAULT_THRESHOLD));
  public readonly windowSize = signal<number>(this.readStoredNumber(STORAGE_KEY_WINDOW_SIZE, DEFAULT_WINDOW_SIZE));

  public readonly overThreshold = computed(() => this.status() === 'running' && this.volume() >= this.threshold());

  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;
  private stream?: MediaStream;
  private animationFrame?: number;
  private timeData?: Uint8Array<ArrayBuffer>;

  private readonly levelWindow: number[] = [];

  constructor() {
    this.destroyRef.onDestroy(() => this.stop());
  }

  ngOnDestroy(): void {
    this.stop();
  }

  public async start(): Promise<void> {
    if (this.status() === 'running' || this.status() === 'starting') {
      return;
    }
    this.errorName.set('');
    this.status.set('starting');

    if (!navigator.mediaDevices?.getUserMedia) {
      this.errorName.set('NotSupportedError');
      this.status.set('error');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
    } catch (err) {
      const name = err instanceof DOMException ? err.name : 'UnknownError';
      this.errorName.set(name);
      this.status.set('error');
      return;
    }

    const audioContextCtor = window.AudioContext
      ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioContext = new audioContextCtor();
    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.5;
    source.connect(this.analyser);
    this.timeData = new Uint8Array(new ArrayBuffer(this.analyser.fftSize));

    this.status.set('running');
    this.zone.runOutsideAngular(() => this.tick());
  }

  public stop(): void {
    if (this.animationFrame !== undefined) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
    void this.audioContext?.close().catch(() => undefined);
    this.audioContext = undefined;
    this.analyser = undefined;
    this.timeData = undefined;
    this.levelWindow.length = 0;
    if (this.status() !== 'error') {
      this.status.set('idle');
    }
    this.volume.set(0);
  }

  public toggle(): void {
    if (this.status() === 'running') {
      this.stop();
    } else {
      void this.start();
    }
  }

  public onThresholdChange(value: number): void {
    this.threshold.set(value);
    this.storageService.setItem(STORAGE_KEY_THRESHOLD, JSON.stringify(value));
  }

  public onWindowSizeChange(value: number): void {
    this.windowSize.set(value);
    this.storageService.setItem(STORAGE_KEY_WINDOW_SIZE, JSON.stringify(value));
    while (this.levelWindow.length > value) {
      this.levelWindow.shift();
    }
  }

  private readStoredNumber(key: string, fallback: number): number {
    const stored = this.storageService.getItem(key);
    if (stored === null) {
      return fallback;
    }
    const parsed = Number(JSON.parse(stored));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private tick(): void {
    if (!this.analyser || !this.timeData) {
      return;
    }
    this.analyser.getByteTimeDomainData(this.timeData);

    let sumSquares = 0;
    for (const sample of this.timeData) {
      const normalized = (sample - 128) / 128;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / this.timeData.length);

    // Convert RMS to a 0-100 scale using a dBFS mapping (-60 dB floor).
    const db = 20 * Math.log10(rms || 1e-8);
    const level = Math.max(0, Math.min(100, ((db + 60) / 60) * 100));

    // Smooth the displayed value with a rolling average to reduce flickering.
    this.levelWindow.push(level);
    while (this.levelWindow.length > this.windowSize()) {
      this.levelWindow.shift();
    }
    const smoothed = this.levelWindow.reduce((sum, value) => sum + value, 0) / this.levelWindow.length;

    this.zone.run(() => this.volume.set(Math.round(smoothed)));

    this.animationFrame = requestAnimationFrame(() => this.tick());
  }
}
