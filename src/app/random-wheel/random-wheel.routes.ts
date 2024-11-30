import {Routes} from '@angular/router';
import {WheelPageComponent} from './wheel-page/wheel-page.component';

export const randomWheelRoutes: Routes = [
  {
    path: '',
    component: WheelPageComponent,
    data: {
      backRouterNavigate: '[back]',
      mainTitle: 'main-title.wheel',
    },
  },
];
