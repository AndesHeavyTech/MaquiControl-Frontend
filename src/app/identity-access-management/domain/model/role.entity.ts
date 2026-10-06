import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { RoleName } from './role-name';

export class Role implements BaseEntity {
  readonly #id: number;
  readonly #name: RoleName;
  readonly #description: string;

  constructor(props: { id: number; name: RoleName; description: string }) {
    if (props.id <= 0) {
      throw new Error('Role identifier must be a positive number.');
    }

    if (props.description.trim().length === 0) {
      throw new Error('Role description cannot be empty.');
    }

    this.#id = props.id;
    this.#name = props.name;
    this.#description = props.description.trim();
  }

  get id(): number {
    return this.#id;
  }

  get name(): RoleName {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  isAdministrative(): boolean {
    return (
      this.#name === RoleName.FleetAdministrator || this.#name === RoleName.SystemAdministrator
    );
  }
}
