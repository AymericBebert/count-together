import {Location} from '@angular/common';
import {inject, Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {simplifyURL} from '../utils/simplify-url';

interface NavButtonClick {
  id: string;
  navigationExtras?: NavigationExtras;
}

@Injectable({
  providedIn: 'root',
})
export class NavButtonsService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  private backRouterNavigate = '';

  private readonly _navButtonClicked$ = new Subject<NavButtonClick>();

  public navButtonClicked$(buttonId?: string): Observable<NavButtonClick> {
    if (buttonId) {
      return this._navButtonClicked$.pipe(filter(btn => btn.id === buttonId));
    }
    return this._navButtonClicked$.asObservable();
  }

  public setBackRouterLink(backRouterNavigate: string): void {
    this.backRouterNavigate = backRouterNavigate;
  }

  public backClicked(): void {
    if (this.backRouterNavigate && this.backRouterNavigate.startsWith('/')) {
      this.router.navigate([this.backRouterNavigate]).catch(e => console.error('Navigation error:', e));
    } else if (this.backRouterNavigate === '[back]') {
      this.location.back();
    } else if (this.backRouterNavigate) {
      try {
        const snapshotUrl = this.router.routerState.snapshot.url;
        const current = this.router.parseUrl(snapshotUrl).root.children.primary.segments.map(s => s.path);
        const destination = simplifyURL([...current, ...this.backRouterNavigate.split('/')]);
        this.router.navigate(destination).catch(e => console.error('Navigation error:', e));
      } catch (err) {
        console.error(`Error trying to navigate to ${this.backRouterNavigate}`, err);
      }
    }
  }

  public navButtonClicked(buttonId: string, navigationExtras?: NavigationExtras): void {
    this._navButtonClicked$.next({id: buttonId, navigationExtras});
  }
}
