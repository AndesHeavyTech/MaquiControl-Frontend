import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { BreakdownReport } from './breakdown-report.entity';
import { MaintenanceStatus } from './maintenance-status';
import { MaintenanceType } from './maintenance-type';
import { Money } from './money.value-object';

export class Maintenance implements BaseEntity {
  readonly #id: number;
  readonly #machineryId: number;
  readonly #type: MaintenanceType;
  readonly #status: MaintenanceStatus;
  readonly #description: string;
  readonly #scheduledDate: Date;
  readonly #startedAt: Date | null;
  readonly #completedAt: Date | null;
  readonly #technicianName: string | null;
  readonly #cost: Money | null;
  readonly #breakdownReports: BreakdownReport[];

  constructor(props: {
    id: number;
    machineryId: number;
    type: MaintenanceType;
    status: MaintenanceStatus;
    description: string;
    scheduledDate: Date;
    startedAt: Date | null;
    completedAt: Date | null;
    technicianName: string | null;
    cost: Money | null;
    breakdownReports: BreakdownReport[];
  }) {
    if (props.id <= 0 || props.machineryId <= 0) {
      throw new Error('Maintenance identifiers must be positive numbers.');
    }

    if (props.description.trim().length === 0) {
      throw new Error('Maintenance description cannot be empty.');
    }

    if (props.cost !== null && !props.cost.isNonNegative()) {
      throw new Error('Maintenance cost cannot be negative.');
    }

    if (props.status === MaintenanceStatus.Completed && props.completedAt === null) {
      throw new Error('A completed maintenance must record a completion date.');
    }

    this.#id = props.id;
    this.#machineryId = props.machineryId;
    this.#type = props.type;
    this.#status = props.status;
    this.#description = props.description.trim();
    this.#scheduledDate = props.scheduledDate;
    this.#startedAt = props.startedAt;
    this.#completedAt = props.completedAt;
    this.#technicianName = props.technicianName;
    this.#cost = props.cost;
    this.#breakdownReports = props.breakdownReports;
  }

  get id(): number {
    return this.#id;
  }

  get machineryId(): number {
    return this.#machineryId;
  }

  get type(): MaintenanceType {
    return this.#type;
  }

  get status(): MaintenanceStatus {
    return this.#status;
  }

  get description(): string {
    return this.#description;
  }

  get scheduledDate(): Date {
    return this.#scheduledDate;
  }

  get startedAt(): Date | null {
    return this.#startedAt;
  }

  get completedAt(): Date | null {
    return this.#completedAt;
  }

  get technicianName(): string | null {
    return this.#technicianName;
  }

  get cost(): Money | null {
    return this.#cost;
  }

  get breakdownReports(): BreakdownReport[] {
    return this.#breakdownReports;
  }

  isPending(): boolean {
    return this.#status === MaintenanceStatus.Scheduled;
  }
}
