import { SignUpCommand } from '../domain/model/sign-up.command';
import { AccountStatus } from '../domain/model/account-status';
import { SignUpRequest } from './sign-up.request';
import { SignUpResource, SignUpResponse } from './sign-up-response';

/**
 * The Contractor role's id in the `roles` collection.
 *
 * README 4.6.1 documents the registration policy: a newly registered
 * account is assigned the Contractor role by default. There is no policy
 * engine on the frontend, so this constant is where that rule lives until
 * the real backend enforces it server-side.
 */
const DEFAULT_ROLE_ID_ON_REGISTRATION = 1;

export class SignUpAssembler {
  toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    const now = new Date().toISOString();

    return {
      email: command.email,
      credential: {
        passwordHash: command.password,
        changedAt: now,
      },
      status: AccountStatus.Active,
      roleIds: [DEFAULT_ROLE_ID_ON_REGISTRATION],
      createdAt: now,
      lastLoginAt: null,
    };
  }

  toResourceFromResponse(response: SignUpResponse): SignUpResource {
    return {
      id: response.id,
      email: response.email,
      status: response.status,
      roleIds: response.roleIds,
    };
  }
}
