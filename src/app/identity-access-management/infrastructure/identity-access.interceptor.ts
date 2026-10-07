import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IdentityAccessStore } from '../application/identity-access-store';

export const identityAccessInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(IdentityAccessStore);
  const token = store.currentToken();

  const handledRequest = token
    ? request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) })
    : request;

  return next(handledRequest);
};
