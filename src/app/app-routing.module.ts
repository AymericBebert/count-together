import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameComponent} from './game/game.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      navTools: [{name: 'nav-tool.wheel', icon: 'near_me'}],
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
        {name: 'nav-tool.duplicate', icon: 'content_copy'},
      ],
    },
  },
  {
    path: 'game/:gameId/wheel',
    loadChildren: () => import('./random-wheel/random-wheel.module').then(mod => mod.RandomWheelModule),
  },
  {
    path: 'wheel',
    loadChildren: () => import('./random-wheel/random-wheel.module').then(mod => mod.RandomWheelModule),
  },
  {
    path: 'sound-share',
    loadChildren: () => import('./sound-sharing/sound-sharing.module').then(mod => mod.SoundSharingModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
