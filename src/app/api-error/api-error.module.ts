import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ApiErrorService} from './api-error.service';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
  ],
  providers: [
    ApiErrorService,
  ],
})
export class ApiErrorModule {
}
