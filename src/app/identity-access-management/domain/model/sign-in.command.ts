export class SignInCommand {
  readonly #email: string;
  readonly #password: string;

  constructor(props: { email: string; password: string }) {
    if (props.email.trim().length === 0 || props.password.length === 0) {
      throw new Error('Email and password are required to sign in.');
    }

    this.#email = props.email.trim().toLowerCase();
    this.#password = props.password;
  }

  get email(): string {
    return this.#email;
  }

  get password(): string {
    return this.#password;
  }
}
