import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ServiceOperation } from '../domain/model/service-operation.entity';
import { ServiceOperationApiEndpoint } from './service-operation-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class OperationsManagementApi extends BaseApi {
  readonly #serviceOperationEndpoint = new ServiceOperationApiEndpoint(this.http);

  getServiceOperations(): Observable<ServiceOperation[]> {
    return this.#serviceOperationEndpoint.getAll();
  }

  createServiceOperation(operation: ServiceOperation): Observable<ServiceOperation> {
    return this.#serviceOperationEndpoint.create(operation);
  }

  updateServiceOperation(operation: ServiceOperation, id: number): Observable<ServiceOperation> {
    return this.#serviceOperationEndpoint.update(operation, id);
  }
}
