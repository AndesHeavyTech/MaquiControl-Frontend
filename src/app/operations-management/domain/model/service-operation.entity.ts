import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { OperationStatus } from './operation-status';
import { WorkedHours } from './worked-hours.entity';

export class ServiceOperation implements BaseEntity {
  readonly #id: number;
  readonly #rentalId: number;
  readonly #machineryId: number;
  readonly #operatorProfileId: number | null;
  readonly #status: OperationStatus;
  readonly #startedAt: Date | null;
  readonly #completedAt: Date | null;
  readonly #workedHours: WorkedHours[];

  constructor(props: {
    id: number;
    rentalId: number;
    machineryId: number;
    operatorProfileId: number | null;
    status: OperationStatus;
    startedAt: Date | null;
    completedAt: Date | null;
    workedHours: WorkedHours[];
  }) {
    if (props.id <= 0 || props.rentalId <= 0 || props.machineryId <= 0) {
      throw new Error('Service operation identifiers must be positive numbers.');
    }

    if (props.status === OperationStatus.Completed && props.completedAt === null) {
      throw new Error('A completed service operation must record a completion date.');
    }

    this.#id = props.id;
    this.#rentalId = props.rentalId;
    this.#machineryId = props.machineryId;
    this.#operatorProfileId = props.operatorProfileId;
    this.#status = props.status;
    this.#startedAt = props.startedAt;
    this.#completedAt = props.completedAt;
    this.#workedHours = props.workedHours;
  }

  get id(): number {
    return this.#id;
  }

  get rentalId(): number {
    return this.#rentalId;
  }

  get machineryId(): number {
    return this.#machineryId;
  }

  get operatorProfileId(): number | null {
    return this.#operatorProfileId;
  }

  get status(): OperationStatus {
    return this.#status;
  }

  get startedAt(): Date | null {
    return this.#startedAt;
  }

  get completedAt(): Date | null {
    return this.#completedAt;
  }

  get workedHours(): WorkedHours[] {
    return this.#workedHours;
  }

  isInProgress(): boolean {
    return this.#status === OperationStatus.InProgress;
  }

  calculateTotalHours(): number {
    return this.#workedHours.reduce((total, record) => total + record.totalHours, 0);
  }
}
