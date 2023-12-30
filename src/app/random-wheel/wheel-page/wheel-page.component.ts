import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {merge, of, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {SettingsService} from '../../service/settings.service';

@Component({
  selector: 'app-wheel-page',
  templateUrl: './wheel-page.component.html',
  styleUrls: ['./wheel-page.component.scss']
})
export class WheelPageComponent {
  public resetIndex = 0;

  public names$ = this.route.queryParams.pipe(
    map(params => (params.names as string || '').split(',')),
  );

  public setSliderValue$ = merge(
    of(5),
    this.route.queryParams.pipe(filter(params => !!params.nb), map(params => parseInt(params.nb, 10))),
    this.names$.pipe(map(names => names.length)),
  );

  public sliderNb$ = new Subject<number>();

  public nb$ = merge(
    this.setSliderValue$,
    this.sliderNb$,
  );

  constructor(public settings: SettingsService,
              private route: ActivatedRoute,
  ) {
  }

  public onNumberSliderChange(value: number): void {
    this.sliderNb$.next(value);
  }
}
