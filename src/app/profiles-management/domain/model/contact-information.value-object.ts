export class ContactInformation {
  readonly #phoneNumber: string;
  readonly #secondaryEmail: string | null;
  readonly #address: string;
  readonly #district: string;
  readonly #city: string;

  constructor(props: {
    phoneNumber: string;
    secondaryEmail: string | null;
    address: string;
    district: string;
    city: string;
  }) {
    const requiredFields = [props.phoneNumber, props.address, props.district, props.city];

    if (requiredFields.some((value) => value.trim().length === 0)) {
      throw new Error('Contact information fields cannot be empty.');
    }

    const secondaryEmail = props.secondaryEmail?.trim() || null;

    if (secondaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(secondaryEmail)) {
      throw new Error('Contact information secondary email is invalid.');
    }

    this.#phoneNumber = props.phoneNumber.trim();
    this.#secondaryEmail = secondaryEmail;
    this.#address = props.address.trim();
    this.#district = props.district.trim();
    this.#city = props.city.trim();
  }

  get phoneNumber(): string {
    return this.#phoneNumber;
  }

  get secondaryEmail(): string | null {
    return this.#secondaryEmail;
  }

  get address(): string {
    return this.#address;
  }

  get district(): string {
    return this.#district;
  }

  get city(): string {
    return this.#city;
  }

  isValid(): boolean {
    return (
      this.#phoneNumber.length > 0 &&
      this.#address.length > 0 &&
      this.#district.length > 0 &&
      this.#city.length > 0
    );
  }

  formattedAddress(): string {
    return `${this.#address}, ${this.#district}, ${this.#city}`;
  }
}
