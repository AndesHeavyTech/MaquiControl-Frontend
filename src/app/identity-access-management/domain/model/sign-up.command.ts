export class SignUpCommand {
  readonly #email: string;
  readonly #password: string;
  readonly #roleId: number;

  constructor(props: { email: string; password: string; roleId: number }) {
    if (props.email.trim().length === 0 || props.password.length === 0) {
      throw new Error('Email and password are required to sign up.');
    }
    if (!Number.isInteger(props.roleId) || props.roleId <= 0) {
      throw new Error('A role is required to sign up.');
    }

    this.#email = props.email.trim().toLowerCase();
    this.#password = props.password;
    this.#roleId = props.roleId;
  }

  get email(): string {
    return this.#email;
  }

  get password(): string {
    return this.#password;
  }

  get roleId(): number {
    return this.#roleId;
  }
}
