export type Currency = 'PEN' | 'USD';

export class Money {
  readonly #amount: number;
  readonly #currency: Currency;

  constructor(props: { amount: number; currency: Currency }) {
    if (!Number.isFinite(props.amount)) {
      throw new Error('Money amount must be a finite number.');
    }

    this.#amount = props.amount;
    this.#currency = props.currency;
  }

  get amount(): number {
    return this.#amount;
  }

  get currency(): Currency {
    return this.#currency;
  }

  add(other: Money): Money {
    if (this.#currency !== other.currency) {
      throw new Error('Cannot add amounts expressed in different currencies.');
    }

    return new Money({ amount: this.#amount + other.amount, currency: this.#currency });
  }

  isNonNegative(): boolean {
    return this.#amount >= 0;
  }
}
