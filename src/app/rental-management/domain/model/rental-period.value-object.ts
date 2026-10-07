export class RentalPeriod {
  readonly #startDate: Date;
  readonly #endDate: Date;

  constructor(props: { startDate: Date; endDate: Date }) {
    if (props.endDate.getTime() < props.startDate.getTime()) {
      throw new Error('Rental period end date cannot be before the start date.');
    }

    this.#startDate = props.startDate;
    this.#endDate = props.endDate;
  }

  get startDate(): Date {
    return this.#startDate;
  }

  get endDate(): Date {
    return this.#endDate;
  }

  durationInDays(): number {
    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
    const days = Math.round((this.#endDate.getTime() - this.#startDate.getTime()) / MILLISECONDS_PER_DAY);

    return Math.max(days, 1);
  }

  overlaps(other: RentalPeriod): boolean {
    return (
      this.#startDate.getTime() <= other.endDate.getTime() &&
      other.startDate.getTime() <= this.#endDate.getTime()
    );
  }

  isValid(): boolean {
    return this.#endDate.getTime() >= this.#startDate.getTime();
  }
}
