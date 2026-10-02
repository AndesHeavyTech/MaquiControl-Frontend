import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Machinery } from '../domain/model/machinery.entity';
import { MachineryAssembler } from './machinery-assembler';
import { MachineryResource, MachineryResponse } from './machinery-response';

export class MachineryApiEndpoint extends BaseApiEndpoint<
  Machinery,
  MachineryResource,
  MachineryResponse,
  MachineryAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/machinery`, new MachineryAssembler());
  }
}
