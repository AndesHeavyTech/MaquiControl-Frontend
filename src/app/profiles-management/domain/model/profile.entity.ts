import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { ContactInformation } from './contact-information.value-object';

export class Profile implements BaseEntity {
  readonly #id: number;
  readonly #userAccountId: number;
  readonly #organizationId: number | null;
  readonly #firstName: string;
  readonly #lastName: string;
  readonly #documentNumber: string;
  readonly #contactInformation: ContactInformation;
  readonly #createdAt: Date;
  readonly #updatedAt: Date;

  constructor(props: {
    id: number;
    userAccountId: number;
    organizationId: number | null;
    firstName: string;
    lastName: string;
    documentNumber: string;
    contactInformation: ContactInformation;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props.id <= 0 || props.userAccountId <= 0) {
      throw new Error('Profile identifiers must be positive numbers.');
    }

    if (props.firstName.trim().length === 0 || props.lastName.trim().length === 0) {
      throw new Error('Profile first name and last name cannot be empty.');
    }

    if (props.documentNumber.trim().length === 0) {
      throw new Error('Profile document number cannot be empty.');
    }

    this.#id = props.id;
    this.#userAccountId = props.userAccountId;
    this.#organizationId = props.organizationId;
    this.#firstName = props.firstName.trim();
    this.#lastName = props.lastName.trim();
    this.#documentNumber = props.documentNumber.trim();
    this.#contactInformation = props.contactInformation;
    this.#createdAt = props.createdAt;
    this.#updatedAt = props.updatedAt;
  }

  get id(): number {
    return this.#id;
  }

  get userAccountId(): number {
    return this.#userAccountId;
  }

  get organizationId(): number | null {
    return this.#organizationId;
  }

  get firstName(): string {
    return this.#firstName;
  }

  get lastName(): string {
    return this.#lastName;
  }

  get documentNumber(): string {
    return this.#documentNumber;
  }

  get contactInformation(): ContactInformation {
    return this.#contactInformation;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  fullName(): string {
    return `${this.#firstName} ${this.#lastName}`;
  }

  belongsToOrganization(): boolean {
    return this.#organizationId !== null;
  }
}
