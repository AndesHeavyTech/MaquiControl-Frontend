import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { identityAccessInterceptor } from './identity-access-management/infrastructure/identity-access.interceptor';
import { SIGN_IN_PORT } from './identity-access-management/infrastructure/sign-in.port';
import { SignInApiEndpoint } from './identity-access-management/infrastructure/sign-in-api-endpoint';
import { FakeSignInApiEndpoint } from './identity-access-management/infrastructure/fake-sign-in-api-endpoint';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([identityAccessInterceptor])),
    provideRouter(routes),
    {
      provide: SIGN_IN_PORT,
      useClass: environment.production ? SignInApiEndpoint : FakeSignInApiEndpoint,
    },
  ],
};
