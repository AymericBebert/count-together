import {DragDropModule} from '@angular/cdk/drag-drop';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
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
import {UpdaterModule} from './updater/updater.module';
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
        deps: [HttpClient]
      }
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
    GameSettingsService,
    NavService,
    NavButtonsService,
    SettingsService,
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [
    GameNameDialogComponent,
    PlayerNameDialogComponent,
    ScoreDialogComponent,
    ConfirmDialogComponent,
  ],
})
export class AppModule {
}
