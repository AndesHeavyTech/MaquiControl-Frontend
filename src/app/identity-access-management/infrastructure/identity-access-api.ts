import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Role } from '../domain/model/role.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { RoleApiEndpoint } from './role-api-endpoint';
import { SignInResource } from './sign-in-response';
import { SIGN_IN_PORT } from './sign-in.port';
import { SignUpApiEndpoint } from './sign-up-api-endpoint';
import { SignUpResource } from './sign-up-response';

@Injectable({
  providedIn: 'root',
})
export class IdentityAccessApi extends BaseApi {
  readonly #signUpEndpoint = new SignUpApiEndpoint(
    this.http,
    `${environment.apiBaseUrl}/authentication/sign-up`,
  );
  readonly #signInEndpoint = inject(SIGN_IN_PORT);
  readonly #roleEndpoint = new RoleApiEndpoint(this.http);

  signUp(command: SignUpCommand): Observable<SignUpResource> {
    return this.#signUpEndpoint.signUp(command);
  }

  signIn(command: SignInCommand): Observable<SignInResource> {
    return this.#signInEndpoint.signIn(command);
  }

  getRoles(): Observable<Role[]> {
    return this.#roleEndpoint.getAll();
  }

  userAccountExists(id: number): Observable<boolean> {
    return this.http.get(`${environment.apiBaseUrl}/user-accounts/${id}`).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => of(error.status !== 404)),
    );
  }
}
