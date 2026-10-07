import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { WorkedHoursStatus } from './worked-hours-status';

export class WorkedHours implements BaseEntity {
  readonly #id: number;
  readonly #workDate: Date;
  readonly #startTime: string;
  readonly #endTime: string;
  readonly #totalHours: number;
  readonly #status: WorkedHoursStatus;
  readonly #observations: string | null;

  constructor(props: {
    id: number;
    workDate: Date;
    startTime: string;
    endTime: string;
    totalHours: number;
    status: WorkedHoursStatus;
    observations: string | null;
  }) {
    if (props.id <= 0) {
      throw new Error('Worked hours identifier must be a positive number.');
    }

    if (props.totalHours < 0) {
      throw new Error('Worked hours total cannot be negative.');
    }

    this.#id = props.id;
    this.#workDate = props.workDate;
    this.#startTime = props.startTime;
    this.#endTime = props.endTime;
    this.#totalHours = props.totalHours;
    this.#status = props.status;
    this.#observations = props.observations;
  }

  get id(): number {
    return this.#id;
  }

  get workDate(): Date {
    return this.#workDate;
  }

  get startTime(): string {
    return this.#startTime;
  }

  get endTime(): string {
    return this.#endTime;
  }

  get totalHours(): number {
    return this.#totalHours;
  }

  get status(): WorkedHoursStatus {
    return this.#status;
  }

  get observations(): string | null {
    return this.#observations;
  }

  isValidated(): boolean {
    return this.#status === WorkedHoursStatus.Validated;
  }
}
