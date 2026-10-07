import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Maintenance } from '../domain/model/maintenance.entity';
import { MaintenanceAssembler } from './maintenance-assembler';
import { MaintenanceResource, MaintenanceResponse } from './maintenance-response';

export class MaintenanceApiEndpoint extends BaseApiEndpoint<
  Maintenance,
  MaintenanceResource,
  MaintenanceResponse,
  MaintenanceAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/maintenances`, new MaintenanceAssembler());
  }
}
