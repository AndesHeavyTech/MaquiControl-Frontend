import { PaymentStatus } from './payment-status';

export interface Payment {
  id: string;
  status: PaymentStatus | string;
  externalReference: string | null;
}
