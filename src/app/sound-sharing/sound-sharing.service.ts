import {inject, Injectable, signal} from '@angular/core';
import {RecordService} from './record.service';

const dtmfFrequencies = [
  [697, 770, 852, 941],
  [1209, 1336, 1477],
];

const dtmfFrequencies_ = dtmfFrequencies.flat();

const dtmfChars = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

function findDtmfIndex(data: Uint8Array, freqIndices: number[]): number {
  let max = 64; // threshold
  let index = -1;
  for (let i = 0; i < freqIndices.length; i++) {
    const amplitudeAtFrequency = data[freqIndices[i]];
    if (amplitudeAtFrequency > max) {
      max = amplitudeAtFrequency;
      index = i;
    }
  }
  return index;
}

/* eslint-disable @typescript-eslint/naming-convention */
const dtmfCharToFrequencies: Record<string, { f1: number; f2: number }> = {
  '1': {f1: 697, f2: 1209},
  '2': {f1: 697, f2: 1336},
  '3': {f1: 697, f2: 1477},
  '4': {f1: 770, f2: 1209},
  '5': {f1: 770, f2: 1336},
  '6': {f1: 770, f2: 1477},
  '7': {f1: 852, f2: 1209},
  '8': {f1: 852, f2: 1336},
  '9': {f1: 852, f2: 1477},
  '*': {f1: 941, f2: 1209},
  '0': {f1: 941, f2: 1336},
  '#': {f1: 941, f2: 1477},
};

const charToDtmfMap: Record<string, string> = {
  '0': '00', '1': '01', '2': '02', '3': '03', '4': '04', '5': '05',
  '6': '06', '7': '07', '8': '08', '9': '09',
  'a': '10', 'b': '11', 'c': '12', 'd': '13', 'e': '14', 'f': '15',
  'g': '16', 'h': '17', 'i': '18', 'j': '19', 'k': '20', 'l': '21',
  'm': '22', 'n': '23', 'o': '24', 'p': '25', 'q': '26', 'r': '27',
  's': '28', 't': '29', 'u': '30', 'v': '31', 'w': '32', 'x': '33',
  'y': '34', 'z': '35',
  'A': '36', 'B': '37', 'C': '38', 'D': '39', 'E': '40', 'F': '41',
  'G': '42', 'H': '43', 'I': '44', 'J': '45', 'K': '46', 'L': '47',
  'M': '48', 'N': '49', 'O': '50', 'P': '51', 'Q': '52', 'R': '53',
  'S': '54', 'T': '55', 'U': '56', 'V': '57', 'W': '58', 'X': '59',
  'Y': '60', 'Z': '61',
};
/* eslint-enable @typescript-eslint/naming-convention */

const dtmfToCharMap = Object.entries(charToDtmfMap).reduce<Record<string, string>>(
  (acc, [k, v]) => ({...acc, [v]: k}),
  {},
);

@Injectable()
export class SoundSharingService {
  private readonly recordService = inject(RecordService);
  public readonly fftSize = 1024;

  public readonly freqGraph = signal<number[]>(dtmfFrequencies_.map(() => 0));

  public readonly receivedPayload = signal<string>('');
  public readonly receivedCode = signal<string>('');

  private readonly playTime = 120;
  private readonly pauseTime = 20;
  private readonly sampleTime = 10;

  private readonly comboToRegister = Math.round(0.75 * this.playTime / this.sampleTime);

  public readonly analysing = signal<boolean>(false);
  private analysingInterval: number | undefined;

  public static stringToDtmf(payload: string): string {
    return [...payload].reduce((acc, cur) => acc + charToDtmfMap[cur], '');
  }

  public static cutChar(data: string): string {
    return [...data].reduce((acc, cur, i) => acc && i % 2 === 0 ? acc + ' ' + cur : acc + cur, '');
  }

  public static soundEncode(payload: string): string {
    return '**' + SoundSharingService.stringToDtmf(payload) + '#';
  }

  public static soundDecode(data: string): { cut: string; decoded: string } {
    const cut = SoundSharingService.cutChar(data.replace(/^\*+/g, '').replace(/#+$/g, ''));
    const decoded = cut.split(' ').reduce(
      (acc, cur) => acc + (dtmfToCharMap[cur] || '?'),
      '',
    );
    return {cut, decoded};
  }

  public async soundShare(payload: string) {
    const data = SoundSharingService.soundEncode(payload);
    console.log('Sound sharing', payload, '->', data);

    const audioCtx = new (window.AudioContext)();

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc1.frequency.value = dtmfCharToFrequencies['*'].f1;
    osc2.frequency.value = dtmfCharToFrequencies['*'].f2;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;

    osc1.connect(gainNode);
    osc2.connect(gainNode);

    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();

    for (const x of data) {
      gainNode.gain.value = 1;
      osc1.frequency.value = dtmfCharToFrequencies[x].f1;
      osc2.frequency.value = dtmfCharToFrequencies[x].f2;
      await new Promise(r => setTimeout(r, this.playTime));
      gainNode.gain.value = 0;
      await new Promise(r => setTimeout(r, this.pauseTime));
    }

    osc1.stop();
    osc2.stop();
  }

  public stopAnalysing() {
    this.analysing.set(false);
    this.freqGraph.set(dtmfFrequencies_.map(() => 0));
    if (this.analysingInterval) {
      clearInterval(this.analysingInterval);
    }
    this.recordService.stopStream();
  }

  public soundAnalyse(): void {
    const stream = this.recordService.stream$.getValue();
    if (!stream) {
      console.error('No audio stream available.');
      return;
    }

    const audioCtx = new (window.AudioContext)();

    // Calculate DTMF frequency indices
    const binWidthInHz = audioCtx.sampleRate / this.fftSize;
    const freqIndices = dtmfFrequencies_.map(f => Math.round(f / binWidthInHz));
    const freqIndices0 = dtmfFrequencies[0].map(f => Math.round(f / binWidthInHz));
    const freqIndices1 = dtmfFrequencies[1].map(f => Math.round(f / binWidthInHz));

    // Create source from the stream
    const source = audioCtx.createMediaStreamSource(stream);

    // Create an analyser node
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = this.fftSize;
    analyser.smoothingTimeConstant = 0;

    source.connect(analyser);

    // Frequency data buffer
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Reset received data
    this.receivedPayload.set('');
    this.receivedCode.set('');
    this.analysing.set(true);

    // Start analysing
    let last: string;
    let counter = 0;

    this.analysingInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);

      this.freqGraph.set(freqIndices.map(fi => dataArray[fi]));

      const x = findDtmfIndex(dataArray, freqIndices0);
      const y = findDtmfIndex(dataArray, freqIndices1);
      if (x >= 0 && y >= 0) {
        const c = dtmfChars[x][y];
        if (last == c) {
          counter++;
          if (counter > this.comboToRegister) {
            this.onCharReceived(c);
            counter = 0;
          }
        } else {
          counter = 0;
        }
        last = c;
      }
    }, this.sampleTime) as unknown as number;
  }

  private onCharReceived(c: string): void {
    this.receivedPayload.update(p => p + c);
    if (c === '*') {
      this.receivedPayload.set('*');
    }
    if (c === '#') {
      const result = SoundSharingService.soundDecode(this.receivedPayload());
      this.receivedCode.set(result.decoded);
      this.stopAnalysing();
    }
  }
}
