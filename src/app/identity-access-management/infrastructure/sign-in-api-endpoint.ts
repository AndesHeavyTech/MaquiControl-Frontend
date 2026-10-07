import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignInAssembler } from './sign-in-assembler';
import { SignInResource, SignInResponse } from './sign-in-response';
import { SignInPort } from './sign-in.port';

const signInEndpointUrl = `${environment.apiBaseUrl}/authentication/sign-in`;

export class SignInApiEndpoint extends ErrorHandlingEnabledBaseType implements SignInPort {
  readonly #http = inject(HttpClient);
  readonly #assembler = new SignInAssembler();

  signIn(command: SignInCommand): Observable<SignInResource> {
    const request = this.#assembler.toRequestFromCommand(command);

    return this.#http.post<SignInResponse>(signInEndpointUrl, request).pipe(
      map((response) => this.#assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to sign in')),
    );
  }
}
