import {provideHttpClient, withFetch} from '@angular/common/http';
import {isDevMode, provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withRouterConfig} from '@angular/router';
import {provideServiceWorker} from '@angular/service-worker';
import {provideTranslateLoader, provideTranslateService, TranslateLoader} from '@ngx-translate/core';
import {from, Observable} from 'rxjs';
import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {APP_CONFIG, appConfigFactory} from './config/app.config';

export class BundledTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(import(`./assets/i18n/${lang}.json`).then(translations => translations.default));
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withRouterConfig({canceledNavigationResolution: 'computed'})),
    provideHttpClient(withFetch()),
    {provide: APP_CONFIG, useFactory: appConfigFactory},
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideTranslateService({
      loader: provideTranslateLoader(BundledTranslateLoader),
    }),
  ],
}).catch((err) => console.error(err));
