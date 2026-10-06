import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityAccessApi } from '../infrastructure/identity-access-api';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';

const TOKEN_STORAGE_KEY = 'mc-token';

@Injectable({
  providedIn: 'root',
})
export class IdentityAccessStore {
  readonly #api = inject(IdentityAccessApi);

  readonly #isSignedIn = signal(false);
  readonly #currentEmail = signal<string | null>(null);
  readonly #currentUserId = signal<number | null>(null);
  readonly #currentRoleIds = signal<number[]>([]);
  readonly #submitting = signal(false);
  readonly #error = signal<string | null>(null);

  readonly isSignedIn = this.#isSignedIn.asReadonly();
  readonly currentEmail = this.#currentEmail.asReadonly();
  readonly currentUserId = this.#currentUserId.asReadonly();
  readonly currentRoleIds = this.#currentRoleIds.asReadonly();
  readonly submitting = this.#submitting.asReadonly();
  readonly error = this.#error.asReadonly();

  readonly currentToken = computed(() =>
    this.isSignedIn() ? localStorage.getItem(TOKEN_STORAGE_KEY) : null,
  );

  /**
   * Sign-up and sign-in are POST/GET requests that create a record or start
   * a session: unlike `FleetManagementStore.loadMachinery()`, they are never
   * retried automatically, a transient-failure retry on sign-up could create
   * a duplicate account.
   */
  signUp(command: SignUpCommand, router: Router): void {
    this.#submitting.set(true);
    this.#error.set(null);

    this.#api.signUp(command).subscribe({
      next: () => {
        this.#submitting.set(false);
        router.navigate(['/identity/sign-in']).then();
      },
      error: (error: Error) => {
        this.#submitting.set(false);
        this.#error.set(error.message);
      },
    });
  }

  signIn(command: SignInCommand, router: Router): void {
    this.#submitting.set(true);
    this.#error.set(null);

    this.#api.signIn(command).subscribe({
      next: (resource) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, resource.token);
        this.#isSignedIn.set(true);
        this.#currentEmail.set(resource.email);
        this.#currentUserId.set(resource.id);
        this.#currentRoleIds.set(resource.roleIds);
        this.#submitting.set(false);
        router.navigate(['/home']).then();
      },
      error: (error: Error) => {
        this.#isSignedIn.set(false);
        this.#currentEmail.set(null);
        this.#currentUserId.set(null);
        this.#currentRoleIds.set([]);
        this.#submitting.set(false);
        this.#error.set(error.message);
      },
    });
  }

  signOut(router: Router): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.#isSignedIn.set(false);
    this.#currentEmail.set(null);
    this.#currentUserId.set(null);
    this.#currentRoleIds.set([]);
    router.navigate(['/identity/sign-in']).then();
  }
}
