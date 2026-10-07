import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { SignUpAssembler } from './sign-up-assembler';
import { SignUpResource, SignUpResponse } from './sign-up-response';

export class SignUpApiEndpoint extends ErrorHandlingEnabledBaseType {
  readonly #assembler = new SignUpAssembler();

  constructor(
    private readonly http: HttpClient,
    private readonly endpointUrl: string,
  ) {
    super();
  }

  signUp(command: SignUpCommand): Observable<SignUpResource> {
    const request = this.#assembler.toRequestFromCommand(command);

    return this.http.post<SignUpResponse>(this.endpointUrl, request).pipe(
      map((response) => this.#assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to sign up')),
    );
  }
}
