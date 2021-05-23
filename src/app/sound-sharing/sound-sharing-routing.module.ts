import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SoundDebugComponent} from './sound-debug/sound-debug.component';
import {SoundSharingComponent} from './sound-sharing/sound-sharing.component';

const routes: Routes = [
  {
    path: '',
    component: SoundSharingComponent,
    data: {
      backRouterNavigate: '/',
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
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoundSharingRoutingModule {
}
