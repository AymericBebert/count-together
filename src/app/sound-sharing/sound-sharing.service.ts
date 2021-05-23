import {Injectable} from '@angular/core';
import {RecordService} from './record.service';

@Injectable()
export class SoundSharingService {
  public readonly FFT_SIZE = 4096;

  public readonly GAIN_0 = 1;
  public readonly GAIN_1 = 1;

  public readonly FREQUENCY_0 = 3800;
  public readonly FREQUENCY_1 = 4000;

  public readonly FFT_INDEX_0 = Math.round(this.FREQUENCY_0 / 11.72);
  public readonly FFT_INDEX_1 = Math.round(this.FREQUENCY_1 / 11.72);

  public dataArray: Uint8Array;

  private readonly TIME_STEP = 160;

  private audioCtx: AudioContext;
  private analyser: AnalyserNode;
  private hearing = '';

  private analysing = false;
  private swapStatus = false;
  private swapTime = performance.now();

  constructor(private readonly recordService: RecordService) {
    console.log('-hint-');
    console.log(SoundSharingService.soundDecode(SoundSharingService.soundEncode('aym3ric5').replace(/^0+|0+$/g, '')));
    console.log('=hint=');
  }

  private static soundEncode(payload: string): string {
    return '001' + [...atob(payload)].reduce((acc, cur) => acc + cur.charCodeAt(0).toString(2).padStart(8, '0'), '') + '100';
  }

  private static soundDecode(data: string): string {
    // console.log('decode', data);
    const cut = [...data.substring(1, data.length - 1)].reduce(
      (acc, cur, i) => acc && i % 8 === 0 ? acc + ' ' + cur : acc + cur,
      '',
    );
    console.log('cut', cut);
    const decoded = btoa(cut.split(' ').reduce(
      (acc, cur) => acc + String.fromCharCode(parseInt(cur, 2)),
      '',
    ));
    console.log('decoded', decoded);
    return decoded;
  }

  public async soundShare(payload: string) {
    payload = 'aym3ric5';
    console.log('Sound sharing', payload);

    // const data = '1001110100101010';
    // const data = '101010101010101010101010';
    const data = SoundSharingService.soundEncode(payload);

    const audioCtx = new (window.AudioContext)();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = this.GAIN_0;
    oscillator.frequency.value = this.FREQUENCY_0;
    oscillator.type = 'sine';
    oscillator.start();

    for (const x of data) {
      oscillator.frequency.value = x === '1' ? this.FREQUENCY_1 : this.FREQUENCY_0;
      gainNode.gain.value = x === '1' ? this.GAIN_1 : this.GAIN_0;
      await new Promise(r => setTimeout(r, this.TIME_STEP));
    }

    oscillator.stop();
  }

  public stopAnalysing() {
    this.analysing = false;
  }

  public async soundAnalyse() {
    const stream = this.recordService.stream$.getValue();
    if (!stream) {
      return;
    }

    this.audioCtx = new (window.AudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = this.FFT_SIZE;
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

    this.analyser.getByteFrequencyData(this.dataArray);
    const f0 = this.dataArray[this.FFT_INDEX_0];
    const f1 = this.dataArray[this.FFT_INDEX_1];

    if (f0 > 128 && f1 > 128 && (this.swapStatus && f1 >= f0 || !this.swapStatus && f1 < f0)) {
      this.swapStatus = f1 < f0;
      const newSwapTime = performance.now();
      const swapDelta = newSwapTime - this.swapTime;
      this.swapTime = newSwapTime;
      const steps = Math.round(swapDelta / this.TIME_STEP);
      if (steps <= 10) {
        new Array(steps).fill(1).forEach(() => this.hearing += this.swapStatus ? '1' : '0');
      }
      console.log(this.swapStatus ? '1' : '0', steps, swapDelta);
    }

    if (this.hearing && (performance.now() - this.swapTime > this.TIME_STEP * 10)) {
      SoundSharingService.soundDecode(this.hearing);
      this.hearing = '';
    }
  }
}
