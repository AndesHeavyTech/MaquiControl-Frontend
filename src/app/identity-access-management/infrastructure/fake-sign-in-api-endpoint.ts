import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignInResource } from './sign-in-response';
import { SignInPort } from './sign-in.port';

const userAccountsEndpointUrl = `${environment.apiBaseUrl}/user-accounts`;

export class FakeSignInApiEndpoint implements SignInPort {
  readonly #http = inject(HttpClient);

  signIn(command: SignInCommand): Observable<SignInResource> {
    const params = new HttpParams()
      .set('email', command.email)
      .set('credential.passwordHash', command.password);

    return this.#http.get<SignInResource[]>(userAccountsEndpointUrl, { params }).pipe(
      map((accounts) => {
        if (accounts.length === 0) {
          throw new Error('Invalid email or password');
        }

        const account = accounts[0];

        return {
          id: account.id,
          email: account.email,
          status: account.status,
          roleIds: account.roleIds,
          token: String(account.id),
        };
      }),
      catchError((error: Error) => throwError(() => new Error(`Failed to sign in: ${error.message}`))),
    );
  }
}
