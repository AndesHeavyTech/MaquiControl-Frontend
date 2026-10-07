import { DOCUMENT } from '@angular/common';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { identityAccessInterceptor } from './identity-access-management/infrastructure/identity-access.interceptor';
import { SIGN_IN_PORT } from './identity-access-management/infrastructure/sign-in.port';
import { SignInApiEndpoint } from './identity-access-management/infrastructure/sign-in-api-endpoint';
import { FakeSignInApiEndpoint } from './identity-access-management/infrastructure/fake-sign-in-api-endpoint';
import { TranslatedTitleStrategy } from './shared/infrastructure/translated-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([identityAccessInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'en',
    }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      const document = inject(DOCUMENT);
      translate.onLangChange.subscribe(({ lang }) => (document.documentElement.lang = lang));
      translate.addLangs(['en', 'es-419']);
      return translate.use('en');
    }),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
    {
      provide: SIGN_IN_PORT,
      useClass: environment.production ? SignInApiEndpoint : FakeSignInApiEndpoint,
    },
  ],
};
