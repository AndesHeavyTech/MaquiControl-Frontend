import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { Payment } from '../domain/model/payment';
import { CheckoutPreferenceRequest, CheckoutPreferenceResource } from './checkout-preference';

interface PaymentResource {
  id: number | string;
  status: string;
  externalReference: string | null;
}

/**
 * Mercado Pago (sandbox) through the platform API: the Access Token is a
 * secret, so the frontend never calls Mercado Pago directly.
 */
export class PaymentApiEndpoint extends ErrorHandlingEnabledBaseType {
  readonly #endpointUrl = `${environment.paymentsApiBaseUrl}/payments`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  createCheckoutPreference(request: CheckoutPreferenceRequest): Observable<CheckoutPreferenceResource> {
    return this.http
      .post<CheckoutPreferenceResource>(`${this.#endpointUrl}/checkout-preferences`, request)
      .pipe(catchError(this.handleError('Failed to start the payment')));
  }

  getPayment(paymentId: string): Observable<Payment> {
    return this.http.get<PaymentResource>(`${this.#endpointUrl}/${encodeURIComponent(paymentId)}`).pipe(
      map((resource) => ({
        id: String(resource.id),
        status: resource.status,
        externalReference: resource.externalReference,
      })),
      catchError(this.handleError('Failed to confirm the payment')),
    );
  }
}
