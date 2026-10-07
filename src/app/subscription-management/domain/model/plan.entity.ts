import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Money } from './money.value-object';
import { PlanCode } from './plan-code';

export class Plan implements BaseEntity {
  readonly #id: number;
  readonly #code: PlanCode;
  readonly #monthlyPrice: Money;
  readonly #machineryLimit: number;
  readonly #recommended: boolean;

  constructor(props: {
    id: number;
    code: PlanCode;
    monthlyPrice: Money;
    machineryLimit: number;
    recommended: boolean;
  }) {
    if (props.id <= 0) {
      throw new Error('Plan identifier must be a positive number.');
    }

    if (props.monthlyPrice.amount <= 0) {
      throw new Error('Plan monthly price must be greater than zero.');
    }

    if (!Number.isInteger(props.machineryLimit) || props.machineryLimit <= 0) {
      throw new Error('Plan machinery limit must be a positive integer.');
    }

    this.#id = props.id;
    this.#code = props.code;
    this.#monthlyPrice = props.monthlyPrice;
    this.#machineryLimit = props.machineryLimit;
    this.#recommended = props.recommended;
  }

  get id(): number {
    return this.#id;
  }

  get code(): PlanCode {
    return this.#code;
  }

  get monthlyPrice(): Money {
    return this.#monthlyPrice;
  }

  get machineryLimit(): number {
    return this.#machineryLimit;
  }

  get recommended(): boolean {
    return this.#recommended;
  }
}
