import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Role } from '../domain/model/role.entity';
import { RoleAssembler } from './role-assembler';
import { RoleResource, RoleResponse } from './role-response';

/**
 * Roles are reference data defined by the platform (see `RoleName`): the
 * UI only ever reads them to label a `UserAccount`'s `roleIds`, so only
 * `getAll()` is exercised even though `BaseApiEndpoint` exposes the full
 * CRUD contract.
 */
export class RoleApiEndpoint extends BaseApiEndpoint<Role, RoleResource, RoleResponse, RoleAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/roles`, new RoleAssembler());
  }
}
