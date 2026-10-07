import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { OrganizationType } from './organization-type';

export class Organization implements BaseEntity {
  readonly #id: number;
  readonly #legalName: string;
  readonly #tradeName: string | null;
  readonly #taxId: string;
  readonly #type: OrganizationType;
  readonly #address: string;

  constructor(props: {
    id: number;
    legalName: string;
    tradeName: string | null;
    taxId: string;
    type: OrganizationType;
    address: string;
  }) {
    if (props.id <= 0) {
      throw new Error('Organization identifier must be a positive number.');
    }

    if (props.legalName.trim().length === 0) {
      throw new Error('Organization legal name cannot be empty.');
    }

    if (props.taxId.trim().length === 0) {
      throw new Error('Organization tax id cannot be empty.');
    }

    if (props.address.trim().length === 0) {
      throw new Error('Organization address cannot be empty.');
    }

    this.#id = props.id;
    this.#legalName = props.legalName.trim();
    this.#tradeName = props.tradeName?.trim() || null;
    this.#taxId = props.taxId.trim();
    this.#type = props.type;
    this.#address = props.address.trim();
  }

  get id(): number {
    return this.#id;
  }

  get legalName(): string {
    return this.#legalName;
  }

  get tradeName(): string | null {
    return this.#tradeName;
  }

  get taxId(): string {
    return this.#taxId;
  }

  get type(): OrganizationType {
    return this.#type;
  }

  get address(): string {
    return this.#address;
  }

  isValidTaxId(): boolean {
    return /^\d{8,20}$/.test(this.#taxId);
  }
}
