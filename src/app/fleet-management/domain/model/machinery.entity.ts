import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { MachineryLocation } from './machinery-location.value-object';
import { MachineryStatus } from './machinery-status';
import { MachineryType } from './machinery-type';
import { Money } from './money.value-object';

export class Machinery implements BaseEntity {
  readonly #id: number;
  readonly #ownerProfileId: number;
  readonly #categoryId: number;
  readonly #name: string;
  readonly #description: string;
  readonly #type: MachineryType;
  readonly #brand: string;
  readonly #model: string;
  readonly #manufactureYear: number;
  readonly #hourlyRate: Money;
  readonly #status: MachineryStatus;
  readonly #location: MachineryLocation;
  readonly #createdAt: Date;
  readonly #updatedAt: Date;

  constructor(props: {
    id: number;
    ownerProfileId: number;
    categoryId: number;
    name: string;
    description: string;
    type: MachineryType;
    brand: string;
    model: string;
    manufactureYear: number;
    hourlyRate: Money;
    status: MachineryStatus;
    location: MachineryLocation;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props.id <= 0 || props.ownerProfileId <= 0 || props.categoryId <= 0) {
      throw new Error('Machinery identifiers must be positive numbers.');
    }

    if (
      props.name.trim().length === 0 ||
      props.brand.trim().length === 0 ||
      props.model.trim().length === 0
    ) {
      throw new Error('Machinery name, brand and model cannot be empty.');
    }

    const currentYear = new Date().getFullYear();

    if (props.manufactureYear < 1900 || props.manufactureYear > currentYear) {
      throw new Error('Machinery manufacture year is invalid.');
    }

    this.#id = props.id;
    this.#ownerProfileId = props.ownerProfileId;
    this.#categoryId = props.categoryId;
    this.#name = props.name.trim();
    this.#description = props.description.trim();
    this.#type = props.type;
    this.#brand = props.brand.trim();
    this.#model = props.model.trim();
    this.#manufactureYear = props.manufactureYear;
    this.#hourlyRate = props.hourlyRate;
    this.#status = props.status;
    this.#location = props.location;
    this.#createdAt = props.createdAt;
    this.#updatedAt = props.updatedAt;
  }

  get id(): number {
    return this.#id;
  }

  get ownerProfileId(): number {
    return this.#ownerProfileId;
  }

  get categoryId(): number {
    return this.#categoryId;
  }

  get name(): string {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  get type(): MachineryType {
    return this.#type;
  }

  get brand(): string {
    return this.#brand;
  }

  get model(): string {
    return this.#model;
  }

  get manufactureYear(): number {
    return this.#manufactureYear;
  }

  get hourlyRate(): Money {
    return this.#hourlyRate;
  }

  get status(): MachineryStatus {
    return this.#status;
  }

  get location(): MachineryLocation {
    return this.#location;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  isAvailable(): boolean {
    return this.#status === MachineryStatus.Available;
  }
}
