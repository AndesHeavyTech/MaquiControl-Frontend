import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Organization } from '../domain/model/organization.entity';
import { OrganizationAssembler } from './organization-assembler';
import { OrganizationResource, OrganizationResponse } from './organization-response';

export class OrganizationApiEndpoint extends BaseApiEndpoint<
  Organization,
  OrganizationResource,
  OrganizationResponse,
  OrganizationAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/organizations`, new OrganizationAssembler());
  }
}
