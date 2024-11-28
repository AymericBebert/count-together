import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {ActivatedRoute} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {merge, Observable, of, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {SettingsService} from '../../service/settings.service';
import {WheelComponent} from '../wheel/wheel.component';

@Component({
  selector: 'app-wheel-page',
  templateUrl: './wheel-page.component.html',
  styleUrls: ['./wheel-page.component.scss'],
  imports: [
    TranslateModule,
    AsyncPipe,
    MatSliderModule,
    MatButton,
    WheelComponent,
  ],
})
export class WheelPageComponent {
  public readonly settings = inject(SettingsService);
  private readonly route = inject(ActivatedRoute);

  public resetIndex = 0;

  private readonly qpNames$ = this.route.queryParams.pipe(
    map(params => params.names as string || ''),
    map(names => names ? names.split(',') : null),
  );

  private readonly sliderNames$ = new Subject<string[] | null>();

  public readonly names$: Observable<string[] | null> = merge(this.qpNames$, this.sliderNames$);

  public readonly qpNb$ = merge(
    of(5),
    this.route.queryParams.pipe(filter(params => !!params.nb), map(params => parseInt(params.nb, 10))),
    this.qpNames$.pipe(filter(names => !!names), map(names => names.length)),
  );

  private readonly sliderNb$ = new Subject<number>();

  public readonly nb$: Observable<number> = merge(this.qpNb$, this.sliderNb$);

  public onNumberSliderChange(value: number): void {
    this.sliderNb$.next(value);
    this.sliderNames$.next(null);
  }
}
