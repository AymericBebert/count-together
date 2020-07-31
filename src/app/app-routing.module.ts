import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {GameComponent} from './game/game.component';


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
      navTools: [{name: 'nav-tool.wheel', icon: 'near_me'}],
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
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
