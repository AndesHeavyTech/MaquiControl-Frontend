import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ProfileResponse extends BaseResponse {
  profiles: ProfileResource[];
}

export interface ProfileResource extends BaseResource {
  id: number;
  userAccountId: number;
  organizationId: number | null;
  firstName: string;
  lastName: string;
  documentNumber: string;
  contactInformation: ContactInformationResource;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInformationResource {
  phoneNumber: string;
  secondaryEmail: string | null;
  address: string;
  district: string;
  city: string;
}
