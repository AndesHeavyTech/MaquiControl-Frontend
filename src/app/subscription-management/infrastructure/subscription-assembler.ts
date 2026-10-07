import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionStatus } from '../domain/model/subscription-status';
import { SubscriptionResource, SubscriptionResponse } from './subscription-response';

export class SubscriptionAssembler implements BaseAssembler<
  Subscription,
  SubscriptionResource,
  SubscriptionResponse
> {
  toEntitiesFromResponse(response: SubscriptionResponse): Subscription[] {
    return response.subscriptions.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: SubscriptionResource): Subscription {
    return new Subscription({
      id: resource.id,
      userAccountId: resource.userAccountId,
      planId: resource.planId,
      status: this.toSubscriptionStatus(resource.status),
      paymentId: resource.paymentId,
      createdAt: new Date(resource.createdAt),
      startsAt: resource.startsAt ? new Date(resource.startsAt) : null,
      endsAt: resource.endsAt ? new Date(resource.endsAt) : null,
    });
  }

  toResourceFromEntity(entity: Subscription): SubscriptionResource {
    return {
      id: entity.id,
      userAccountId: entity.userAccountId,
      planId: entity.planId,
      status: entity.status,
      paymentId: entity.paymentId,
      createdAt: entity.createdAt.toISOString(),
      startsAt: entity.startsAt?.toISOString() ?? null,
      endsAt: entity.endsAt?.toISOString() ?? null,
    };
  }

  private toSubscriptionStatus(value: string): SubscriptionStatus {
    if (!Object.values(SubscriptionStatus).includes(value as SubscriptionStatus)) {
      throw new Error(`Unknown subscription status: ${value}`);
    }

    return value as SubscriptionStatus;
  }
}
