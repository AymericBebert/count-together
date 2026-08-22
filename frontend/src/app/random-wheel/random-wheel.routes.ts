import {Routes} from '@angular/router';
import {marker} from '@biesbjerg/ngx-translate-extract-marker';
import {WheelPageComponent} from './wheel-page/wheel-page.component';

export const randomWheelRoutes: Routes = [
  {
    path: '',
    component: WheelPageComponent,
    data: {
      backRouterNavigate: '[back]',
      mainTitle: marker('main-title.wheel'),
    },
  },
];
