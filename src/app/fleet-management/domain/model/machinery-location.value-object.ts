export class MachineryLocation {
  readonly #department: string;
  readonly #province: string;
  readonly #district: string;
  readonly #address: string;

  constructor(props: { department: string; province: string; district: string; address: string }) {
    const values = [props.department, props.province, props.district, props.address];

    if (values.some((value) => value.trim().length === 0)) {
      throw new Error('Machinery location fields cannot be empty.');
    }

    this.#department = props.department.trim();
    this.#province = props.province.trim();
    this.#district = props.district.trim();
    this.#address = props.address.trim();
  }

  get department(): string {
    return this.#department;
  }

  get province(): string {
    return this.#province;
  }

  get district(): string {
    return this.#district;
  }

  get address(): string {
    return this.#address;
  }

  get fullAddress(): string {
    return `${this.#address}, ${this.#district}, ${this.#province}, ${this.#department}`;
  }

  equals(other: MachineryLocation): boolean {
    return (
      this.#department === other.department &&
      this.#province === other.province &&
      this.#district === other.district &&
      this.#address === other.address
    );
  }
}
