import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WheelPageComponent} from './wheel-page/wheel-page.component';

const routes: Routes = [
  {
    path: '',
    component: WheelPageComponent,
    data: {
      backRouterNavigate: '[back]',
      mainTitle: 'main-title.wheel',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RandomWheelRoutingModule {
}
