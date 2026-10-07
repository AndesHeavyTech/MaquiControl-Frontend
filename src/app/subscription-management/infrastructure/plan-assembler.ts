import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Currency, Money } from '../domain/model/money.value-object';
import { Plan } from '../domain/model/plan.entity';
import { PlanCode } from '../domain/model/plan-code';
import { PlanResource, PlanResponse } from './plan-response';

export class PlanAssembler implements BaseAssembler<Plan, PlanResource, PlanResponse> {
  toEntitiesFromResponse(response: PlanResponse): Plan[] {
    return response.plans.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: PlanResource): Plan {
    return new Plan({
      id: resource.id,
      code: this.toPlanCode(resource.code),
      monthlyPrice: new Money({
        amount: resource.monthlyPrice.amount,
        currency: this.toCurrency(resource.monthlyPrice.currency),
      }),
      machineryLimit: resource.machineryLimit,
      recommended: resource.recommended,
    });
  }

  toResourceFromEntity(entity: Plan): PlanResource {
    return {
      id: entity.id,
      code: entity.code,
      monthlyPrice: { amount: entity.monthlyPrice.amount, currency: entity.monthlyPrice.currency },
      machineryLimit: entity.machineryLimit,
      recommended: entity.recommended,
    };
  }

  private toPlanCode(value: string): PlanCode {
    if (!Object.values(PlanCode).includes(value as PlanCode)) {
      throw new Error(`Unknown plan code: ${value}`);
    }

    return value as PlanCode;
  }

  private toCurrency(value: string): Currency {
    if (value !== 'PEN' && value !== 'USD') {
      throw new Error(`Unknown currency: ${value}`);
    }

    return value;
  }
}
