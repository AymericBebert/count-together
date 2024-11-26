import {Routes} from '@angular/router';
import {SoundDebugComponent} from './sound-debug/sound-debug.component';
import {SoundSharingComponent} from './sound-sharing/sound-sharing.component';

export const soundSharingRoutes: Routes = [
  {
    path: '',
    component: SoundSharingComponent,
    data: {
      backRouterNavigate: '[back]',
      mainTitle: 'main-title.sound-share',
    },
  },
  {
    path: 'debug',
    component: SoundDebugComponent,
    data: {
      backRouterNavigate: '.',
      mainTitle: 'main-title.sound-share-debug',
    },
  },
];
