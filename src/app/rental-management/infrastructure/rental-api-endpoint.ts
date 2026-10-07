import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Rental } from '../domain/model/rental.entity';
import { RentalAssembler } from './rental-assembler';
import { RentalResource, RentalResponse } from './rental-response';

export class RentalApiEndpoint extends BaseApiEndpoint<
  Rental,
  RentalResource,
  RentalResponse,
  RentalAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/rentals`, new RentalAssembler());
  }
}
