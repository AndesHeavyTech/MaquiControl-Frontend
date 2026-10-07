/** What the platform API needs to open a Mercado Pago Checkout Pro page. */
export interface CheckoutPreferenceRequest {
  title: string;
  unitPrice: number;
  currencyId: string;
  externalReference: string;
  backUrl: string;
}

export interface CheckoutPreferenceResource {
  id: string;
  initPoint: string;
  sandboxInitPoint: string;
}
