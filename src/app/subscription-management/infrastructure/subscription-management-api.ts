import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Payment } from '../domain/model/payment';
import { Plan } from '../domain/model/plan.entity';
import { Subscription } from '../domain/model/subscription.entity';
import { CheckoutPreferenceRequest, CheckoutPreferenceResource } from './checkout-preference';
import { PaymentApiEndpoint } from './payment-api-endpoint';
import { PlanApiEndpoint } from './plan-api-endpoint';
import { SubscriptionApiEndpoint } from './subscription-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionManagementApi extends BaseApi {
  readonly #planEndpoint = new PlanApiEndpoint(this.http);
  readonly #subscriptionEndpoint = new SubscriptionApiEndpoint(this.http);
  readonly #paymentEndpoint = new PaymentApiEndpoint(this.http);

  getPlans(): Observable<Plan[]> {
    return this.#planEndpoint.getAll();
  }

  getSubscriptionsByUserAccountId(userAccountId: number): Observable<Subscription[]> {
    return this.#subscriptionEndpoint.getByUserAccountId(userAccountId);
  }

  getSubscriptionById(id: number): Observable<Subscription> {
    return this.#subscriptionEndpoint.getById(id);
  }

  createSubscription(subscription: Subscription): Observable<Subscription> {
    return this.#subscriptionEndpoint.create(subscription);
  }

  updateSubscription(subscription: Subscription): Observable<Subscription> {
    return this.#subscriptionEndpoint.update(subscription, subscription.id);
  }

  createCheckoutPreference(request: CheckoutPreferenceRequest): Observable<CheckoutPreferenceResource> {
    return this.#paymentEndpoint.createCheckoutPreference(request);
  }

  getPayment(paymentId: string): Observable<Payment> {
    return this.#paymentEndpoint.getPayment(paymentId);
  }
}
