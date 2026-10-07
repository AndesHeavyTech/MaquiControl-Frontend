/** Payment statuses reported by Mercado Pago that this context reacts to. */
export enum PaymentStatus {
  Approved = 'approved',
  Pending = 'pending',
  InProcess = 'in_process',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
}
