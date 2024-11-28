import {inject, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {RecordService} from './record.service';

@Injectable()
export class SoundSharingService {
  private readonly recordService = inject(RecordService);

  public readonly fftSize = 4096;

  public readonly gain0 = 1;
  public readonly gain1 = 1;

  public readonly frequency0 = 3800;
  public readonly frequency1 = 4000;

  public readonly fftIndex0 = Math.round(this.frequency0 / 11.72);
  public readonly fftIndex1 = Math.round(this.frequency1 / 11.72);

  public readonly receivedPayload$ = new Subject<string>();
  public readonly receivedCode$ = new Subject<string>();

  public dataArray: Uint8Array | undefined;

  private readonly timeStep = 160;

  private audioCtx!: AudioContext;
  private analyser!: AnalyserNode;
  private hearing = '';

  private analysing = false;
  private swapStatus = false;
  private swapTime = performance.now();

  public static stringToBinary(payload: string): string {
    return [...atob(payload)].reduce((acc, cur) => acc + cur.charCodeAt(0).toString(2).padStart(8, '0'), '');
  }

  public static cutBytes(data: string): string {
    return [...data].reduce((acc, cur, i) => acc && i % 8 === 0 ? acc + ' ' + cur : acc + cur, '');
  }

  private static soundEncode(payload: string): string {
    return '001' + SoundSharingService.stringToBinary(payload) + '100';
  }

  private static soundDecode(data: string): { cut: string; decoded: string } {
    const cut = SoundSharingService.cutBytes(data.substring(1, data.length - 1));
    const decoded = btoa(cut.split(' ').reduce(
      (acc, cur) => acc + String.fromCharCode(parseInt(cur, 2)),
      '',
    ));
    return {cut, decoded};
  }

  public async soundShare(payload: string) {
    console.log('Sound sharing', payload);

    // const data = '1001110100101010';
    // const data = '101010101010101010101010';
    const data = SoundSharingService.soundEncode(payload);

    const audioCtx = new (window.AudioContext)();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = this.gain0;
    oscillator.frequency.value = this.frequency0;
    oscillator.type = 'sine';
    oscillator.start();

    for (const x of data) {
      oscillator.frequency.value = x === '1' ? this.frequency1 : this.frequency0;
      gainNode.gain.value = x === '1' ? this.gain1 : this.gain0;
      await new Promise(r => setTimeout(r, this.timeStep));
    }

    oscillator.stop();
  }

  public stopAnalysing() {
    this.analysing = false;
    this.dataArray = undefined;
    this.recordService.stopStream();
  }

  public soundAnalyse(): void {
    const stream = this.recordService.stream$.getValue();
    if (!stream) {
      return;
    }

    this.audioCtx = new (window.AudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    const source = this.audioCtx.createMediaStreamSource(stream);
    source.connect(this.analyser);

    this.analysing = true;
    this.runActiveListening();
  }

  public runActiveListening() {
    if (this.analysing) {
      requestAnimationFrame(this.runActiveListening.bind(this));
    } else {
      return;
    }

    const dataArray = this.dataArray;
    if (!dataArray) {
      throw new Error('No dataArray');
    }
    this.analyser.getByteFrequencyData(dataArray);
    const f0 = dataArray[this.fftIndex0];
    const f1 = dataArray[this.fftIndex1];

    if (f0 > 128 && f1 > 128 && (this.swapStatus && f1 >= f0 || !this.swapStatus && f1 < f0)) {
      this.swapStatus = f1 < f0;
      const newSwapTime = performance.now();
      const swapDelta = newSwapTime - this.swapTime;
      this.swapTime = newSwapTime;
      const steps = Math.round(swapDelta / this.timeStep);
      if (steps <= 10) {
        new Array(steps).fill(1).forEach(() => this.hearing += this.swapStatus ? '1' : '0');
        this.receivedPayload$.next(SoundSharingService.cutBytes(this.hearing.substring(1)));
      }
      console.log(this.swapStatus ? '1' : '0', steps, swapDelta);
    }

    if (this.hearing && (performance.now() - this.swapTime > this.timeStep * 10)) {
      const {cut, decoded} = SoundSharingService.soundDecode(this.hearing);
      this.receivedPayload$.next(cut);
      this.receivedCode$.next(decoded);
      this.hearing = '';
    }
  }
}
