import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface OrganizationResponse extends BaseResponse {
  organizations: OrganizationResource[];
}

export interface OrganizationResource extends BaseResource {
  id: number;
  legalName: string;
  tradeName: string | null;
  taxId: string;
  type: string;
  address: string;
}
