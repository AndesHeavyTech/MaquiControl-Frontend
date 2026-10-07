import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface RoleResponse extends BaseResponse {
  roles: RoleResource[];
}

export interface RoleResource extends BaseResource {
  id: number;
  name: string;
  description: string;
}
