import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {StorageService} from './storage.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    StorageService,
    CookieService,
  ],
})
export class StorageModule {
}
