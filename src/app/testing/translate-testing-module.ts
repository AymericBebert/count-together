import {NgModule} from '@angular/core';
import {provideTranslateService} from '@ngx-translate/core';

@NgModule({
  providers: [provideTranslateService()],
})
export class TranslateTestingModule {
}

export const translateTestingModule = TranslateTestingModule;
