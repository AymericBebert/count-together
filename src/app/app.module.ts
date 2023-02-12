import {DragDropModule} from '@angular/cdk/drag-drop';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {APP_CONFIG, appConfigFactory} from '../config/app.config';
import {environment} from '../environments/environment';
import {ApiErrorModule} from './api-error/api-error.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ConfirmDialogComponent} from './dialogs/confirm-dialog/confirm-dialog.component';
import {GameNameDialogComponent} from './dialogs/game-name-dialog/game-name-dialog.component';
import {NewGameDialogComponent} from './dialogs/new-game-dialog/new-game-dialog.component';
import {PlayerNameDialogComponent} from './dialogs/player-name-dialog/player-name-dialog.component';
import {ScoreDialogComponent} from './dialogs/score-dialog/score-dialog.component';
import {GameComponent} from './game/game.component';
import {HomeComponent} from './home/home.component';
import {ChangeLanguageComponent} from './nav/change-language.component';
import {NavComponent} from './nav/nav.component';
import {RankIconComponent} from './rank-icon/rank-icon.component';
import {DeviceService} from './service/device.service';
import {GameSettingsService} from './service/game-settings.service';
import {GamesService} from './service/games.service';
import {NavButtonsService} from './service/nav-buttons.service';
import {NavService} from './service/nav.service';
import {SettingsService} from './service/settings.service';
import {ShareButtonModule} from './share-button/share-button.module';
import {SocketModule} from './socket/socket.module';
import {StorageModule} from './storage/storage.module';
import {UpdaterService} from './updater/updater.service';
import {DebugHttpInterceptor} from './utils/debug-http.interceptor';

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
    GameNameDialogComponent,
    NewGameDialogComponent,
    PlayerNameDialogComponent,
    ScoreDialogComponent,
    ConfirmDialogComponent,
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
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    FormsModule,
    ReactiveFormsModule,
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
    MatCheckboxModule,
    MatSelectModule,
    DragDropModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    ShareButtonModule,
    SocketModule,
    ApiErrorModule,
    StorageModule,
  ],
  providers: [
    {provide: APP_CONFIG, useFactory: appConfigFactory},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DebugHttpInterceptor,
      multi: true,
    },
    DeviceService,
    UpdaterService,
    GamesService,
    GameSettingsService,
    NavService,
    NavButtonsService,
    SettingsService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
