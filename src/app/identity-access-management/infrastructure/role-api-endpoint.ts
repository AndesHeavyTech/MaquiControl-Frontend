import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Role } from '../domain/model/role.entity';
import { RoleAssembler } from './role-assembler';
import { RoleResource, RoleResponse } from './role-response';

export class RoleApiEndpoint extends BaseApiEndpoint<Role, RoleResource, RoleResponse, RoleAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/roles`, new RoleAssembler());
  }
}
