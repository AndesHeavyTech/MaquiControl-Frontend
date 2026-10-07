import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { IdentityAccessStore } from '../../../application/identity-access-store';
import { SignUpCommand } from '../../../domain/model/sign-up.command';
import { RoleName } from '../../../domain/model/role-name';

/**
 * The two roles a person can pick for themselves when signing up. The other
 * three (Fleet Administrator, Operator, System Administrator) are granted by
 * an organization or by the platform, never self-assigned.
 */
const SELF_SERVICE_ROLES: RoleName[] = [RoleName.Contractor, RoleName.FleetOwner];

/** `?role=` values the landing page links with, e.g. `/identity/sign-up?role=fleet-owner`. */
const ROLE_QUERY_VALUES: Record<string, RoleName> = {
  contractor: RoleName.Contractor,
  'fleet-owner': RoleName.FleetOwner,
};

@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss',
})
export class SignUpForm {
  protected readonly store = inject(IdentityAccessStore);
  readonly #router = inject(Router);

  protected readonly roleOptions = SELF_SERVICE_ROLES;
  protected readonly rolesUnavailable = signal(false);

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    roleName: new FormControl<RoleName>(RoleName.Contractor, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    const requestedRole = inject(ActivatedRoute).snapshot.queryParamMap.get('role');
    const roleName = requestedRole ? ROLE_QUERY_VALUES[requestedRole] : undefined;
    if (roleName) {
      this.form.controls.roleName.setValue(roleName);
    }
  }

  protected performSignUp(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const role = this.store.roles().find((candidate) => candidate.name === this.form.value.roleName);
    if (!role) {
      this.rolesUnavailable.set(true);
      this.store.loadRoles();
      return;
    }
    this.rolesUnavailable.set(false);

    const command = new SignUpCommand({
      email: this.form.value.email!,
      password: this.form.value.password!,
      roleId: role.id,
    });

    this.store.signUp(command, this.#router);
  }
}
