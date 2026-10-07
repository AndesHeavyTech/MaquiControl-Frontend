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

  static fromIsoDates(startDate: string, endDate: string): RentalPeriod {
    return new RentalPeriod({
      startDate: RentalPeriod.parseIsoDate(startDate),
      endDate: RentalPeriod.parseIsoDate(endDate),
    });
  }

  static parseIsoDate(value: string): Date {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  static toIsoDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  static todayIsoDate(): string {
    return RentalPeriod.toIsoDate(new Date());
  }

  get startDate(): Date {
    return this.#startDate;
  }

  get endDate(): Date {
    return this.#endDate;
  }

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
