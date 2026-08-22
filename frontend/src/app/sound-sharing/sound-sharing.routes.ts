import {Routes} from '@angular/router';
import {marker} from '@biesbjerg/ngx-translate-extract-marker';
import {SoundDebugComponent} from './sound-debug/sound-debug.component';
import {SoundSharingComponent} from './sound-sharing/sound-sharing.component';

export const soundSharingRoutes: Routes = [
  {
    path: '',
    component: SoundSharingComponent,
    data: {
      backRouterNavigate: '[back]',
      mainTitle: marker('main-title.sound-share'),
    },
  },
  {
    path: 'debug',
    component: SoundDebugComponent,
    data: {
      backRouterNavigate: '.',
      mainTitle: marker('main-title.sound-share-debug'),
    },
  },
];
