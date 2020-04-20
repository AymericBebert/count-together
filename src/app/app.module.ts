import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NavComponent} from './nav/nav.component';
import {ChangeLanguageComponent} from './nav/change-language.component';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {HomeComponent} from './home/home.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {GameComponent} from './game/game.component';
import {EditionDialogComponent} from './edition-dialog/edition-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {RankIconComponent} from './rank-icon/rank-icon.component';
import {ShareButtonModule} from './share-button/share-button.module';
import {SocketModule} from './socket/socket.module';
import {DebugHttpInterceptor} from './utils/debug-http.interceptor';
import {DeviceService} from './service/device.service';
import {GamesService} from './service/games.service';
import {NavService} from './service/nav.service';
import {NavButtonsService} from './service/nav-buttons.service';
import {SettingsService} from './service/settings.service';
import {MatBadgeModule} from '@angular/material/badge';
import {StorageModule} from './storage/storage.module';
import {UpdaterModule} from './updater/updater.module';
import {ApiErrorModule} from './api-error/api-error.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ChangeLanguageComponent,
    HomeComponent,
    GameComponent,
    EditionDialogComponent,
    RankIconComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    FormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatInputModule,
    MatBadgeModule,
    ShareButtonModule,
    SocketModule,
    ApiErrorModule,
    StorageModule,
    UpdaterModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DebugHttpInterceptor,
      multi: true
    },
    DeviceService,
    GamesService,
    NavService,
    NavButtonsService,
    SettingsService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditionDialogComponent,
  ],
})
export class AppModule {
}
