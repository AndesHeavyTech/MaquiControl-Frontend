import { PaymentStatus } from './payment-status';

/** A Mercado Pago payment as confirmed by the platform API, never by the return URL alone. */
export interface Payment {
  id: string;
  status: PaymentStatus | string;
  /** The `Subscription.id` the checkout was created for. */
  externalReference: string | null;
}
