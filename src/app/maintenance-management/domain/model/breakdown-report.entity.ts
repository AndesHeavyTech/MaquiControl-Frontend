import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { BreakdownSeverity } from './breakdown-severity';

export class BreakdownReport implements BaseEntity {
  readonly #id: number;
  readonly #description: string;
  readonly #severity: BreakdownSeverity;
  readonly #reportedAt: Date;
  readonly #resolvedAt: Date | null;
  readonly #resolved: boolean;

  constructor(props: {
    id: number;
    description: string;
    severity: BreakdownSeverity;
    reportedAt: Date;
    resolvedAt: Date | null;
    resolved: boolean;
  }) {
    if (props.id <= 0) {
      throw new Error('Breakdown report identifier must be a positive number.');
    }

    if (props.description.trim().length === 0) {
      throw new Error('Breakdown report description cannot be empty.');
    }

    if (props.resolved && props.resolvedAt === null) {
      throw new Error('A resolved breakdown report must record a resolution date.');
    }

    this.#id = props.id;
    this.#description = props.description.trim();
    this.#severity = props.severity;
    this.#reportedAt = props.reportedAt;
    this.#resolvedAt = props.resolvedAt;
    this.#resolved = props.resolved;
  }

  get id(): number {
    return this.#id;
  }

  get description(): string {
    return this.#description;
  }

  get severity(): BreakdownSeverity {
    return this.#severity;
  }

  get reportedAt(): Date {
    return this.#reportedAt;
  }

  get resolvedAt(): Date | null {
    return this.#resolvedAt;
  }

  get resolved(): boolean {
    return this.#resolved;
  }

  isCritical(): boolean {
    return this.#severity === BreakdownSeverity.Critical;
  }
}
