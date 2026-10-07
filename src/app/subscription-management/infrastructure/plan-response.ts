import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface PlanResponse extends BaseResponse {
  plans: PlanResource[];
}

export interface PlanResource extends BaseResource {
  id: number;
  code: string;
  monthlyPrice: { amount: number; currency: string };
  machineryLimit: number;
  recommended: boolean;
}
