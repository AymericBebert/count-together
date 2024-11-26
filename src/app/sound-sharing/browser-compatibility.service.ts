import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserCompatibilityService {
  public isUsingIOS(): boolean {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }

  public isMediaApiSupported(): boolean {
    return !!window.navigator.mediaDevices
      && !!window.navigator.mediaDevices.getUserMedia
      && typeof MediaRecorder !== 'undefined';
  }

  public isBrowserSupported(): boolean {
    return this.isMediaApiSupported() && !this.isUsingIOS();
  }

  public getBestAudioMimeType(): string | undefined {
    const mimeTypes = [
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];
    return this.getBestMimeType(mimeTypes);
  }

  public getBestVideoMimeType(): string | undefined {
    const mimeTypes = [
      'video/webm;codecs=vp8,opus',
      'video/mp4',
    ];
    return this.getBestMimeType(mimeTypes);
  }

  private getBestMimeType(mimeTypes: string[]): string | undefined {
    if (!this.isMediaApiSupported()) {
      return undefined;
    }
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }
    return undefined;
  }
}
