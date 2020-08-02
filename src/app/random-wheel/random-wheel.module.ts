import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {WheelComponent} from './wheel/wheel.component';
import {WheelPageComponent} from './wheel-page/wheel-page.component';
import {RandomWheelRoutingModule} from './random-wheel-routing.module';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    RandomWheelRoutingModule,
    HttpClientModule,
    TranslateModule.forChild(),
    MatSliderModule,
    MatButtonModule,
  ],
  declarations: [
    WheelComponent,
    WheelPageComponent,
  ],
  exports: [
    WheelComponent,
    WheelPageComponent,
  ],
  providers: [],
  entryComponents: [],
})
export class RandomWheelModule {
}
