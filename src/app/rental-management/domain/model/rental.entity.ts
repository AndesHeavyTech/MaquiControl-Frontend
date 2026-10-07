import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Money } from './money.value-object';
import { RentalPeriod } from './rental-period.value-object';
import { RentalStatus } from './rental-status';

const STANDARD_WORK_HOURS_PER_DAY = 8;

export class Rental implements BaseEntity {
  readonly #id: number;
  readonly #machineryId: number;
  readonly #contractorProfileId: number;
  readonly #period: RentalPeriod;
  readonly #status: RentalStatus;
  readonly #totalAmount: Money;
  readonly #cancellationReason: string | null;
  readonly #requestedAt: Date;
  readonly #confirmedAt: Date | null;
  readonly #cancelledAt: Date | null;

  constructor(props: {
    id: number;
    machineryId: number;
    contractorProfileId: number;
    period: RentalPeriod;
    status: RentalStatus;
    totalAmount: Money;
    cancellationReason: string | null;
    requestedAt: Date;
    confirmedAt: Date | null;
    cancelledAt: Date | null;
  }) {
    if (props.id <= 0 || props.machineryId <= 0 || props.contractorProfileId <= 0) {
      throw new Error('Rental identifiers must be positive numbers.');
    }

    if (!props.totalAmount.isNonNegative()) {
      throw new Error('Rental total amount cannot be negative.');
    }

    if (props.status === RentalStatus.Cancelled && props.cancelledAt === null) {
      throw new Error('A cancelled rental must record a cancellation date.');
    }

    this.#id = props.id;
    this.#machineryId = props.machineryId;
    this.#contractorProfileId = props.contractorProfileId;
    this.#period = props.period;
    this.#status = props.status;
    this.#totalAmount = props.totalAmount;
    this.#cancellationReason = props.cancellationReason;
    this.#requestedAt = props.requestedAt;
    this.#confirmedAt = props.confirmedAt;
    this.#cancelledAt = props.cancelledAt;
  }

  get id(): number {
    return this.#id;
  }

  get machineryId(): number {
    return this.#machineryId;
  }

  get contractorProfileId(): number {
    return this.#contractorProfileId;
  }

  get period(): RentalPeriod {
    return this.#period;
  }

  get status(): RentalStatus {
    return this.#status;
  }

  get totalAmount(): Money {
    return this.#totalAmount;
  }

  get cancellationReason(): string | null {
    return this.#cancellationReason;
  }

  get requestedAt(): Date {
    return this.#requestedAt;
  }

  get confirmedAt(): Date | null {
    return this.#confirmedAt;
  }

  get cancelledAt(): Date | null {
    return this.#cancelledAt;
  }

  isPending(): boolean {
    return this.#status === RentalStatus.Requested;
  }

  isActive(): boolean {
    return this.#status === RentalStatus.Confirmed || this.#status === RentalStatus.InProgress;
  }

  calculateTotal(hourlyRate: Money): Money {
    return Rental.estimateTotal(this.#period, hourlyRate);
  }

  static estimateTotal(period: RentalPeriod, hourlyRate: Money): Money {
    return hourlyRate.multiply(period.durationInDays() * STANDARD_WORK_HOURS_PER_DAY);
  }
}
