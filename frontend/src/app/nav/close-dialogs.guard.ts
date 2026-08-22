import {inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot} from '@angular/router';

/**
 * Guard that checks if a dialog is open when navigating back in history.
 * If a dialog is open, it closes the last dialog and prevents navigation.
 */
export const closeDialogsChildGuard: CanActivateChildFn = (
  _childRoute: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (router.currentNavigation()?.trigger === 'popstate' && dialog.openDialogs.length > 0) {
    dialog.openDialogs.at(-1)?.close();
    return false;
  }

  return true;
};
