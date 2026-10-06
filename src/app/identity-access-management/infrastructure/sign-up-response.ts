import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SignUpResponse extends BaseResponse, SignUpResource {}

export interface SignUpResource extends BaseResource {
  id: number;
  email: string;
  status: string;
  roleIds: number[];
}
