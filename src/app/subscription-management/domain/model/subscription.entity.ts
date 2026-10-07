import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { SubscriptionStatus } from './subscription-status';

const SUBSCRIPTION_PERIOD_MONTHS = 1;

export class Subscription implements BaseEntity {
  readonly #id: number;
  readonly #userAccountId: number;
  readonly #planId: number;
  readonly #status: SubscriptionStatus;
  readonly #paymentId: string | null;
  readonly #createdAt: Date;
  readonly #startsAt: Date | null;
  readonly #endsAt: Date | null;

  constructor(props: {
    id: number;
    userAccountId: number;
    planId: number;
    status: SubscriptionStatus;
    paymentId: string | null;
    createdAt: Date;
    startsAt: Date | null;
    endsAt: Date | null;
  }) {
    if (props.id <= 0 || props.userAccountId <= 0 || props.planId <= 0) {
      throw new Error('Subscription identifiers must be positive numbers.');
    }

    if (props.status === SubscriptionStatus.Active && (!props.paymentId || !props.startsAt || !props.endsAt)) {
      throw new Error('An active subscription must record its payment and period.');
    }

    this.#id = props.id;
    this.#userAccountId = props.userAccountId;
    this.#planId = props.planId;
    this.#status = props.status;
    this.#paymentId = props.paymentId;
    this.#createdAt = props.createdAt;
    this.#startsAt = props.startsAt;
    this.#endsAt = props.endsAt;
  }

  static request(props: { id: number; userAccountId: number; planId: number }): Subscription {
    return new Subscription({
      ...props,
      status: SubscriptionStatus.PendingPayment,
      paymentId: null,
      createdAt: new Date(),
      startsAt: null,
      endsAt: null,
    });
  }

  get id(): number {
    return this.#id;
  }

  get userAccountId(): number {
    return this.#userAccountId;
  }

  get planId(): number {
    return this.#planId;
  }

  get status(): SubscriptionStatus {
    return this.#status;
  }

  get paymentId(): string | null {
    return this.#paymentId;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get startsAt(): Date | null {
    return this.#startsAt;
  }

  get endsAt(): Date | null {
    return this.#endsAt;
  }

  isActive(now = new Date()): boolean {
    return this.#status === SubscriptionStatus.Active && this.#endsAt !== null && this.#endsAt > now;
  }

  isPendingPayment(): boolean {
    return this.#status === SubscriptionStatus.PendingPayment;
  }

  activate(paymentId: string, now = new Date()): Subscription {
    if (!this.isPendingPayment()) {
      throw new Error('Only a subscription pending payment can be activated.');
    }

    const endsAt = new Date(now);
    endsAt.setMonth(endsAt.getMonth() + SUBSCRIPTION_PERIOD_MONTHS);

    return this.#with({ status: SubscriptionStatus.Active, paymentId, startsAt: now, endsAt });
  }

  cancel(): Subscription {
    return this.#with({ status: SubscriptionStatus.Cancelled });
  }

  #with(changes: Partial<{ status: SubscriptionStatus; paymentId: string; startsAt: Date; endsAt: Date }>): Subscription {
    return new Subscription({
      id: this.#id,
      userAccountId: this.#userAccountId,
      planId: this.#planId,
      status: changes.status ?? this.#status,
      paymentId: changes.paymentId ?? this.#paymentId,
      createdAt: this.#createdAt,
      startsAt: changes.startsAt ?? this.#startsAt,
      endsAt: changes.endsAt ?? this.#endsAt,
    });
  }
}
