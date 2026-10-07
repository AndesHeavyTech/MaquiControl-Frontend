export type Currency = 'PEN' | 'USD';

export class Money {
  readonly #amount: number;
  readonly #currency: Currency;

  constructor(props: { amount: number; currency: Currency }) {
    if (!Number.isFinite(props.amount) || props.amount < 0) {
      throw new Error('Money amount must be a non-negative finite number.');
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
}
