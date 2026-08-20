import {inject, Injectable, signal} from '@angular/core';
import {StorageService} from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly storageService = inject(StorageService);

  public readonly darkMode = signal<boolean>(false);
  public readonly keepAwake = signal<boolean>(false);

  private wakeLock: WakeLockSentinel | null = null;

  constructor() {
    const darkModeFromStorage = this.storageService.getItem('darkMode');
    if (!darkModeFromStorage && window.matchMedia) {
      this.setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches, false);
    }
    this.setDarkMode(!!JSON.parse(darkModeFromStorage || 'false'), false);

    const keepAwakeFromStorage = this.storageService.getItem('keepAwake');
    this.setKeepAwake(!!JSON.parse(keepAwakeFromStorage || 'false'), false);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.keepAwake()) {
        void this.requestWakeLock();
      }
    });
  }

  public setDarkMode(isDark: boolean, register = true): void {
    if (register) {
      this.storageService.setItem('darkMode', JSON.stringify(isDark));
    }
    if (isDark) {
      document.getElementsByTagName('html').item(0)?.setAttribute('dark-theme', 'true');
    } else {
      document.getElementsByTagName('html').item(0)?.removeAttribute('dark-theme');
    }
    this.darkMode.set(isDark);
  }

  public setKeepAwake(keepAwake: boolean, register = true): void {
    if (register) {
      this.storageService.setItem('keepAwake', JSON.stringify(keepAwake));
    }
    this.keepAwake.set(keepAwake);
    if (keepAwake) {
      void this.requestWakeLock();
    } else {
      void this.releaseWakeLock();
    }
  }

  private async requestWakeLock(): Promise<void> {
    if (!('wakeLock' in navigator)) {
      return;
    }
    if (this.wakeLock !== null) {
      return;
    }
    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      this.wakeLock.addEventListener('release', () => {
        this.wakeLock = null;
      });
    } catch (e) {
      console.warn('Could not acquire screen wake lock', e);
    }
  }

  private async releaseWakeLock(): Promise<void> {
    if (this.wakeLock === null) {
      return;
    }
    try {
      await this.wakeLock.release();
    } catch (e) {
      console.warn('Could not release screen wake lock', e);
    } finally {
      this.wakeLock = null;
    }
  }
}
