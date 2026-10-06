import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { IdentityAccessStore } from '../../../application/identity-access-store';
import { SignUpCommand } from '../../../domain/model/sign-up.command';

@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss',
})
export class SignUpForm {
  protected readonly store = inject(IdentityAccessStore);
  readonly #router = inject(Router);

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  protected performSignUp(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const command = new SignUpCommand({
      email: this.form.value.email!,
      password: this.form.value.password!,
    });

    this.store.signUp(command, this.#router);
  }
}
