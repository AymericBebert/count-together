import {InjectionToken} from '@angular/core';

export interface AppConfig {
  version: string;
  backendUrl: string;
  websiteUrl: string;
  debugSocket: boolean;
  tokenLength: number;
}

export function appConfigFactory(): AppConfig {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const appConstants: Partial<AppConfig> = (window as unknown as { APP_CONFIG: Partial<AppConfig> }).APP_CONFIG || {};
  return {
    version: appConstants.version || 'untagged',
    backendUrl: appConstants.backendUrl || 'http://localhost:4050',
    websiteUrl: appConstants.websiteUrl || 'http://localhost:4500',
    debugSocket: appConstants.debugSocket || false,
    tokenLength: appConstants.tokenLength || 8,
  };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
