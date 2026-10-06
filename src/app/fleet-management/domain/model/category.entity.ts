import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Category implements BaseEntity {
  readonly #id: number;
  readonly #name: string;

  constructor(props: { id: number; name: string }) {
    if (props.id <= 0) {
      throw new Error('Category identifier must be a positive number.');
    }

    if (props.name.trim().length === 0) {
      throw new Error('Category name cannot be empty.');
    }

    this.#id = props.id;
    this.#name = props.name.trim();
  }

  get id(): number {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }
}
