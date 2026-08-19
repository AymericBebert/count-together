import {Routes} from '@angular/router';
import {marker} from '@biesbjerg/ngx-translate-extract-marker';
import {SoundMeterComponent} from './sound-meter/sound-meter.component';

export const soundMeterRoutes: Routes = [
  {
    path: '',
    component: SoundMeterComponent,
    data: {
      backRouterNavigate: '[back]',
      mainTitle: marker('main-title.sound-meter'),
    },
  },
];
