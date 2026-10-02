import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Machinery } from '../domain/model/machinery.entity';
import { MachineryApiEndpoint } from './machinery-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class FleetManagementApi extends BaseApi {
  readonly #machineryEndpoint = new MachineryApiEndpoint(this.http);

  getMachinery(): Observable<Machinery[]> {
    return this.#machineryEndpoint.getAll();
  }

  getMachineryById(id: number): Observable<Machinery> {
    return this.#machineryEndpoint.getById(id);
  }
}
