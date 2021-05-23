import {AppConfig} from './app.config';

export const testConfig: AppConfig = {
  version: 'test',
  backendUrl: 'http://localhost:4050',
  websiteUrl: 'http://localhost:9876',
  debugSocket: true,
  debugHttp: true,
  tokenLength: 8,
};
