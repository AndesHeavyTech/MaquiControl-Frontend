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

  /**
   * Inclusive, like `overlaps()`: a rental from the 7th to the 8th blocks
   * both days for other contractors, so both days are billed (2, not 1).
   * A same-day rental counts as 1 day.
   */
  durationInDays(): number {
    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
    const toCalendarDay = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const days = Math.round((toCalendarDay(this.#endDate) - toCalendarDay(this.#startDate)) / MILLISECONDS_PER_DAY);

    return Math.max(days + 1, 1);
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
