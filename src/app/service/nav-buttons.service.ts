import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {simplifyURL} from '../utils/utils';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavButtonsService {
  public backRouterNavigate = '';

  private privateBackButtonClicked$ = new Subject<void>();
  private privateNavButtonClicked$ = new Subject<string>();

  constructor(private router: Router) {
  }

  public backButtonClicked$(): Observable<void> {
    return this.privateBackButtonClicked$;
  }

  public navButtonClicked$(buttonId: string): Observable<string> {
    return this.privateNavButtonClicked$.pipe(filter(btn => btn === buttonId));
  }

  public setBackRouterLink(backRouterNavigate: string) {
    this.backRouterNavigate = backRouterNavigate;
  }

  public backClicked() {
    if (this.backRouterNavigate && this.backRouterNavigate.startsWith('/')) {
      this.router.navigate([this.backRouterNavigate]).catch(e => console.error('Navigation error:', e));
    } else if (this.backRouterNavigate) {
      try {
        const current = this.router.parseUrl(this.router.routerState.snapshot.url).root.children.primary.segments.map(s => s.path);
        const destination = simplifyURL([...current, ...this.backRouterNavigate.split('/')]);
        this.router.navigate(destination).catch(e => console.error('Navigation error:', e));
      } catch (err) {
        console.error(`Error trying to navigate to ${this.backRouterNavigate}: ${err}`);
      }
    }
    this.privateBackButtonClicked$.next();
  }

  public navButtonClicked(buttonId: string) {
    this.privateNavButtonClicked$.next(buttonId);
  }
}
