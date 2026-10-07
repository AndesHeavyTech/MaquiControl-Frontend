export class Credential {
  readonly #passwordHash: string;
  readonly #changedAt: Date;

  constructor(props: { passwordHash: string; changedAt: Date }) {
    if (props.passwordHash.trim().length === 0) {
      throw new Error('Credential password hash cannot be empty.');
    }

    this.#passwordHash = props.passwordHash;
    this.#changedAt = props.changedAt;
  }

  get passwordHash(): string {
    return this.#passwordHash;
  }

  get changedAt(): Date {
    return this.#changedAt;
  }

  matches(plainPassword: string): boolean {
    return this.#passwordHash === plainPassword;
  }

  update(newPasswordHash: string): Credential {
    return new Credential({ passwordHash: newPasswordHash, changedAt: new Date() });
  }
}
