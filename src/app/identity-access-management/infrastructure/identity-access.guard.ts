import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IdentityAccessStore } from '../application/identity-access-store';

export const identityAccessGuard: CanActivateFn = () => {
  const store = inject(IdentityAccessStore);
  const router = inject(Router);

  if (store.isSignedIn()) {
    return true;
  }

  router.navigate(['/identity/sign-in']).then();
  return false;
};
