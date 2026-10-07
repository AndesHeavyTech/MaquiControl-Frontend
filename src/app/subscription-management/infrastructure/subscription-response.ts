import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SubscriptionResponse extends BaseResponse {
  subscriptions: SubscriptionResource[];
}

export interface SubscriptionResource extends BaseResource {
  id: number;
  userAccountId: number;
  planId: number;
  status: string;
  paymentId: string | null;
  createdAt: string;
  startsAt: string | null;
  endsAt: string | null;
}
