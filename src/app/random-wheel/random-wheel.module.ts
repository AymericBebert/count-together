import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {TranslateModule} from '@ngx-translate/core';
import {RandomWheelRoutingModule} from './random-wheel-routing.module';
import {WheelPageComponent} from './wheel-page/wheel-page.component';
import {WheelComponent} from './wheel/wheel.component';

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
