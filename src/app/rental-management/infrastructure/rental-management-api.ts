import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Rental } from '../domain/model/rental.entity';
import { RentalApiEndpoint } from './rental-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class RentalManagementApi extends BaseApi {
  readonly #rentalEndpoint = new RentalApiEndpoint(this.http);

  getRentals(): Observable<Rental[]> {
    return this.#rentalEndpoint.getAll();
  }

  createRental(rental: Rental): Observable<Rental> {
    return this.#rentalEndpoint.create(rental);
  }

  /** Confirm and cancel are both status transitions, persisted as a PUT —
   *  the diagram's `Rental` has no delete/remove use case, only `cancel()`. */
  updateRental(rental: Rental, id: number): Observable<Rental> {
    return this.#rentalEndpoint.update(rental, id);
  }
}
