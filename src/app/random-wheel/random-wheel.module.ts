import {CommonModule} from '@angular/common';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {TranslateModule} from '@ngx-translate/core';
import {RandomWheelRoutingModule} from './random-wheel-routing.module';
import {WheelPageComponent} from './wheel-page/wheel-page.component';
import {WheelComponent} from './wheel/wheel.component';

@NgModule({
  declarations: [
    WheelComponent,
    WheelPageComponent,
  ],
  imports: [
    CommonModule,
    RandomWheelRoutingModule,
    TranslateModule.forChild(),
    MatSliderModule,
    MatButtonModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class RandomWheelModule {
}
