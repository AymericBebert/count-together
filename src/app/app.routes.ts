import {Routes} from '@angular/router';
import {marker} from '@biesbjerg/ngx-translate-extract-marker';
import {GameComponent} from './game/game.component';
import {HomeComponent} from './home/home.component';
import {closeDialogsChildGuard} from './nav/close-dialogs.guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [closeDialogsChildGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          navTools: [
            {name: marker('nav-tool.wheel'), icon: 'near_me'},
            {name: marker('nav-tool.sound-share-receive'), icon: 'mic'},
          ],
        },
      },
      {
        path: 'game/offline',
        component: GameComponent,
        data: {
          backRouterNavigate: '/',
          navButtons: ['share'],
          navTools: [
            {name: marker('nav-tool.wheel'), icon: 'near_me'},
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
            {name: marker('nav-tool.wheel'), icon: 'near_me'},
            {name: marker('nav-tool.sound-share'), icon: 'volume_up'},
            {name: marker('nav-tool.duplicate'), icon: 'content_copy'},
            {name: marker('nav-tool.save-offline'), icon: 'download'},
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
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
