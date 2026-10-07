import { SignUpCommand } from '../domain/model/sign-up.command';
import { AccountStatus } from '../domain/model/account-status';
import { SignUpRequest } from './sign-up.request';
import { SignUpResource, SignUpResponse } from './sign-up-response';

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
      roleIds: [command.roleId],
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
