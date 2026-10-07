import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Plan } from '../domain/model/plan.entity';
import { PlanAssembler } from './plan-assembler';
import { PlanResource, PlanResponse } from './plan-response';

export class PlanApiEndpoint extends BaseApiEndpoint<Plan, PlanResource, PlanResponse, PlanAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/plans`, new PlanAssembler());
  }
}
