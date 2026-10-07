import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { ServiceOperation } from '../domain/model/service-operation.entity';
import { ServiceOperationAssembler } from './service-operation-assembler';
import { ServiceOperationResource, ServiceOperationResponse } from './service-operation-response';

export class ServiceOperationApiEndpoint extends BaseApiEndpoint<
  ServiceOperation,
  ServiceOperationResource,
  ServiceOperationResponse,
  ServiceOperationAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/service-operations`, new ServiceOperationAssembler());
  }
}
