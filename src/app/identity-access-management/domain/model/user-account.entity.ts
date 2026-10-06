import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { AccountStatus } from './account-status';
import { Credential } from './credential.value-object';
import { Role } from './role.entity';
import { RoleName } from './role-name';

export class UserAccount implements BaseEntity {
  readonly #id: number;
  readonly #email: string;
  readonly #credential: Credential;
  readonly #status: AccountStatus;
  readonly #roles: Role[];
  readonly #createdAt: Date;
  readonly #lastLoginAt: Date | null;

  constructor(props: {
    id: number;
    email: string;
    credential: Credential;
    status: AccountStatus;
    roles: Role[];
    createdAt: Date;
    lastLoginAt: Date | null;
  }) {
    if (props.id <= 0) {
      throw new Error('User account identifier must be a positive number.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email.trim())) {
      throw new Error('User account email is invalid.');
    }

    this.#id = props.id;
    this.#email = props.email.trim().toLowerCase();
    this.#credential = props.credential;
    this.#status = props.status;
    this.#roles = props.roles;
    this.#createdAt = props.createdAt;
    this.#lastLoginAt = props.lastLoginAt;
  }

  get id(): number {
    return this.#id;
  }

  get email(): string {
    return this.#email;
  }

  get credential(): Credential {
    return this.#credential;
  }

  get status(): AccountStatus {
    return this.#status;
  }

  get roles(): Role[] {
    return this.#roles;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get lastLoginAt(): Date | null {
    return this.#lastLoginAt;
  }

  isActive(): boolean {
    return this.#status === AccountStatus.Active;
  }

  hasRole(roleName: RoleName): boolean {
    return this.#roles.some((role) => role.name === roleName);
  }
}
