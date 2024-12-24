import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {inject, Injectable, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  public readonly isHandset = signal<boolean>(true);

  public readonly slimToolbar = toSignal(
    this.breakpointObserver.observe('(min-width: 600px) and (max-height: 599px)').pipe(map(result => result.matches))
  );

  constructor() {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches))
      .subscribe(res => this.isHandset.set(res));
  }
}
