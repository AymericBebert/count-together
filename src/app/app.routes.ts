import {Routes} from '@angular/router';
import {GameComponent} from './game/game.component';
import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      navTools: [{name: 'nav-tool.wheel', icon: 'near_me'}],
    },
  },
  {
    path: 'game/offline',
    component: GameComponent,
    data: {
      backRouterNavigate: '/',
      navButtons: ['share'],
      navTools: [
        {name: 'nav-tool.wheel', icon: 'near_me'},
      ],
    },
  },
  {
    path: 'game/:gameId',
    component: GameComponent,
    data: {
      backRouterNavigate: '/',
      navButtons: ['share'],
      navTools: [
        {name: 'nav-tool.wheel', icon: 'near_me'},
        {name: 'nav-tool.sound-share', icon: 'volume_up'},
        {name: 'nav-tool.duplicate', icon: 'content_copy'},
        {name: 'nav-tool.save-offline', icon: 'download'},
      ],
    },
  },
  {
    path: 'game/:gameId/wheel',
    loadChildren: () => import('./random-wheel/random-wheel.routes').then(mod => mod.randomWheelRoutes),
  },
  {
    path: 'wheel',
    loadChildren: () => import('./random-wheel/random-wheel.routes').then(mod => mod.randomWheelRoutes),
  },
  {
    path: 'game/:gameId/sound-share',
    loadChildren: () => import('./sound-sharing/sound-sharing.routes').then(mod => mod.soundSharingRoutes),
  },
  {
    path: 'sound-share',
    loadChildren: () => import('./sound-sharing/sound-sharing.routes').then(mod => mod.soundSharingRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
