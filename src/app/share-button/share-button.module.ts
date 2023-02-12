import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {TranslateModule} from '@ngx-translate/core';
import {ShareButtonComponent} from './share-button.component';
import {ShareButtonService} from './share-button.service';

@NgModule({
  declarations: [
    ShareButtonComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild(),
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    ShareButtonComponent,
  ],
  providers: [
    ShareButtonService,
  ],
})
export class ShareButtonModule {
}
