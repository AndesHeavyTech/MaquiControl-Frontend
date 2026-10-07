import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { finalize, forkJoin, map, Observable, of, retry, switchMap } from 'rxjs';
import { IdentityAccessStore } from '../../identity-access-management/application/identity-access-store';
import { Payment } from '../domain/model/payment';
import { PaymentStatus } from '../domain/model/payment-status';
import { Plan } from '../domain/model/plan.entity';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionManagementApi } from '../infrastructure/subscription-management-api';

/** Where Mercado Pago sends the buyer back after paying (see `CheckoutResult`). */
export const CHECKOUT_RESULT_PATH = '/plans/checkout-result';

export type CheckoutOutcome = 'approved' | 'pending' | 'rejected';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionManagementStore {
  readonly #api = inject(SubscriptionManagementApi);
  readonly #identityAccessStore = inject(IdentityAccessStore);

  readonly #plans = signal<Plan[]>([]);
  readonly #subscriptions = signal<Subscription[]>([]);
  readonly #loading = signal(false);
  readonly #error = signal<string | null>(null);
  readonly #processing = signal(false);
  readonly #processError = signal<string | null>(null);
  readonly #checkoutOutcome = signal<CheckoutOutcome | null>(null);

  readonly plans = this.#plans.asReadonly();
  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly processing = this.#processing.asReadonly();
  readonly processError = this.#processError.asReadonly();
  readonly checkoutOutcome = this.#checkoutOutcome.asReadonly();

  readonly currentSubscription = computed(
    () => this.#subscriptions().find((subscription) => subscription.isActive()) ?? null,
  );

  readonly currentPlan = computed(() => {
    const subscription = this.currentSubscription();
    return subscription ? (this.planById(subscription.planId) ?? null) : null;
  });

  constructor() {
    this.loadPlans();

    // Subscriptions belong to the signed-in account: reload them whenever it changes.
    effect(() => {
      const userAccountId = this.#identityAccessStore.currentUserId();
      untracked(() => (userAccountId === null ? this.#subscriptions.set([]) : this.loadSubscriptions(userAccountId)));
    });
  }

  loadPlans(): void {
    this.#loading.set(true);
    this.#error.set(null);

    this.#api
      .getPlans()
      .pipe(
        retry(2),
        finalize(() => this.#loading.set(false)),
      )
      .subscribe({
        next: (plans) => this.#plans.set(plans),
        error: (error: Error) => {
          this.#plans.set([]);
          this.#error.set(error.message);
        },
      });
  }

  loadSubscriptions(userAccountId: number): void {
    this.#api
      .getSubscriptionsByUserAccountId(userAccountId)
      .pipe(retry(2))
      .subscribe({
        next: (subscriptions) => this.#subscriptions.set(subscriptions),
        error: () => this.#subscriptions.set([]),
      });
  }

  planById(id: number): Plan | undefined {
    return this.#plans().find((plan) => plan.id === id);
  }

  /**
   * US-042: records the subscription as pending payment, asks the platform
   * API for a Mercado Pago checkout and leaves the app to pay there.
   * Never retried: a retry could create a second subscription or checkout.
   */
  subscribe(plan: Plan, checkoutTitle: string): void {
    const userAccountId = this.#identityAccessStore.currentUserId();
    if (userAccountId === null) {
      return;
    }

    this.#processing.set(true);
    this.#processError.set(null);

    // json-server keeps the id it receives: a timestamp cannot collide with another owner's request.
    const subscription = Subscription.request({ id: Date.now(), userAccountId, planId: plan.id });

    this.#api
      .createSubscription(subscription)
      .pipe(
        switchMap((created) =>
          this.#api.createCheckoutPreference({
            title: checkoutTitle,
            unitPrice: plan.monthlyPrice.amount,
            currencyId: plan.monthlyPrice.currency,
            externalReference: String(created.id),
            backUrl: `${window.location.origin}${CHECKOUT_RESULT_PATH}`,
          }),
        ),
      )
      .subscribe({
        next: (preference) => window.location.assign(preference.initPoint),
        error: (error: Error) => {
          this.#processing.set(false);
          this.#processError.set(error.message);
        },
      });
  }

  /**
   * Back from Mercado Pago: the payment is read again through the platform
   * API, because the status in the return URL can be edited by anyone.
   */
  confirmCheckout(paymentId: string | null): void {
    this.#checkoutOutcome.set(null);
    this.#processError.set(null);

    if (!paymentId || paymentId === 'null') {
      this.#checkoutOutcome.set('rejected');
      return;
    }

    this.#processing.set(true);

    this.#api
      .getPayment(paymentId)
      .pipe(
        switchMap((payment) => this.#applyPayment(payment)),
        finalize(() => this.#processing.set(false)),
      )
      .subscribe({
        next: (outcome) => {
          this.#checkoutOutcome.set(outcome);
          const userAccountId = this.#identityAccessStore.currentUserId();
          if (userAccountId !== null) {
            this.loadSubscriptions(userAccountId);
          }
        },
        error: (error: Error) => this.#processError.set(error.message),
      });
  }

  #applyPayment(payment: Payment): Observable<CheckoutOutcome> {
    const subscriptionId = Number(payment.externalReference);
    if (!Number.isInteger(subscriptionId) || subscriptionId <= 0) {
      throw new Error('The payment does not belong to a MaquiControl subscription.');
    }

    return this.#api.getSubscriptionById(subscriptionId).pipe(
      switchMap((subscription) => {
        if (subscription.userAccountId !== this.#identityAccessStore.currentUserId()) {
          throw new Error('The payment belongs to another account.');
        }

        // Reloading this page must not activate it twice.
        if (subscription.isActive() && subscription.paymentId === payment.id) {
          return of<CheckoutOutcome>('approved');
        }

        if (payment.status === PaymentStatus.Approved && subscription.isPendingPayment()) {
          return this.#activate(subscription, payment.id);
        }

        const pending = payment.status === PaymentStatus.Pending || payment.status === PaymentStatus.InProcess;
        return of<CheckoutOutcome>(pending ? 'pending' : 'rejected');
      }),
    );
  }

  /** The new plan replaces any plan the owner had active. */
  #activate(subscription: Subscription, paymentId: string): Observable<CheckoutOutcome> {
    const replaced = this.#subscriptions()
      .filter((other) => other.id !== subscription.id && other.isActive())
      .map((other) => this.#api.updateSubscription(other.cancel()));

    return forkJoin([this.#api.updateSubscription(subscription.activate(paymentId)), ...replaced]).pipe(
      map((): CheckoutOutcome => 'approved'),
    );
  }
}
