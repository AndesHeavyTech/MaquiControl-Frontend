import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { IdentityAccessStore } from '../application/identity-access-store';
import { RoleName } from '../domain/model/role-name';

/**
 * Lets the route through only when the signed-in account has one of
 * `allowedRoles`; anyone else is sent home. Roles come from the API after
 * startup, so on a reload the decision waits until they have been loaded.
 */
export const roleGuard =
  (...allowedRoles: RoleName[]): CanActivateFn =>
  () => {
    const store = inject(IdentityAccessStore);
    const router = inject(Router);

    return toObservable(store.rolesLoaded).pipe(
      filter((loaded) => loaded),
      take(1),
      map(() => (store.hasAnyRole(allowedRoles) ? true : router.createUrlTree(['/home']))),
    );
  };
