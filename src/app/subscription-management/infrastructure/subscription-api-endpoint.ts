import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionAssembler } from './subscription-assembler';
import { SubscriptionResource, SubscriptionResponse } from './subscription-response';

export class SubscriptionApiEndpoint extends BaseApiEndpoint<
  Subscription,
  SubscriptionResource,
  SubscriptionResponse,
  SubscriptionAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/subscriptions`, new SubscriptionAssembler());
  }

  getByUserAccountId(userAccountId: number): Observable<Subscription[]> {
    const params = new HttpParams().set('userAccountId', userAccountId);

    return this.http.get<SubscriptionResource[]>(this.endpointUrl, { params }).pipe(
      map((resources) => resources.map((resource) => this.assembler.toEntityFromResource(resource))),
      catchError(this.handleError('Failed to fetch subscriptions')),
    );
  }
}
