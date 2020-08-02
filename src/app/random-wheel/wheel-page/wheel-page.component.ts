import {Component, OnDestroy, OnInit} from '@angular/core';
import {merge, Observable, of, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {MatSliderChange} from '@angular/material/slider';
import {SettingsService} from '../../service/settings.service';

@Component({
  selector: 'app-wheel-page',
  templateUrl: './wheel-page.component.html',
  styleUrls: ['./wheel-page.component.scss']
})
export class WheelPageComponent implements OnInit, OnDestroy {

  public names$: Observable<string[]>;
  public nb$: Observable<number>;
  public setSliderValue$: Observable<number>;
  public sliderNb$ = new Subject<number>();
  public resetIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(public settings: SettingsService,
              private route: ActivatedRoute,
  ) {
    this.names$ = this.route.queryParams.pipe(filter(params => !!params.names), map(params => (params.names as string).split(',')));

    this.setSliderValue$ = merge(
      of(5),
      this.route.queryParams.pipe(filter(params => !!params.nb), map(params => parseInt(params.nb, 10))),
      this.names$.pipe(map(names => names.length)),
    );

    this.nb$ = merge(
      this.setSliderValue$,
      this.sliderNb$,
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNumberSliderChange($event: MatSliderChange) {
    this.sliderNb$.next($event.value);
  }
}
