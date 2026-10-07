import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityAccessApi } from '../infrastructure/identity-access-api';
import { Role } from '../domain/model/role.entity';
import { RoleName } from '../domain/model/role-name';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';

const TOKEN_STORAGE_KEY = 'mc-token';
const SESSION_STORAGE_KEY = 'mc-session';

interface StoredSession {
  email: string;
  userId: number;
  roleIds: number[];
}

function readStoredSession(): (StoredSession & { token: string }) | null {
  try {
    const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    const rawSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!token || !rawSession) {
      return null;
    }
    const session = JSON.parse(rawSession) as StoredSession;
    if (typeof session.email !== 'string' || typeof session.userId !== 'number' || !Array.isArray(session.roleIds)) {
      return null;
    }
    return { ...session, token };
  } catch {
    return null;
  }
}

@Injectable({
  providedIn: 'root',
})
export class IdentityAccessStore {
  readonly #api = inject(IdentityAccessApi);
  readonly #injector = inject(Injector);

  readonly #isSignedIn = signal(false);
  readonly #currentEmail = signal<string | null>(null);
  readonly #currentUserId = signal<number | null>(null);
  readonly #currentRoleIds = signal<number[]>([]);
  readonly #roles = signal<Role[]>([]);
  readonly #rolesLoaded = signal(false);
  readonly #submitting = signal(false);
  readonly #error = signal<string | null>(null);

  readonly isSignedIn = this.#isSignedIn.asReadonly();
  readonly currentEmail = this.#currentEmail.asReadonly();
  readonly currentUserId = this.#currentUserId.asReadonly();
  readonly currentRoleIds = this.#currentRoleIds.asReadonly();
  readonly roles = this.#roles.asReadonly();
  readonly rolesLoaded = this.#rolesLoaded.asReadonly();
  readonly submitting = this.#submitting.asReadonly();
  readonly error = this.#error.asReadonly();

  readonly currentToken = computed(() =>
    this.isSignedIn() ? sessionStorage.getItem(TOKEN_STORAGE_KEY) : null,
  );

  readonly currentRoles = computed(() =>
    this.#currentRoleIds()
      .map((id) => this.roleById(id))
      .filter((role): role is Role => role !== undefined),
  );

  constructor() {
    this.#restoreSession();

    queueMicrotask(() => {
      this.#validateRestoredAccount();
      this.loadRoles();
    });
  }

  hasRole(roleName: RoleName): boolean {
    return this.currentRoles().some((role) => role.name === roleName);
  }

  hasAnyRole(roleNames: RoleName[]): boolean {
    return roleNames.some((roleName) => this.hasRole(roleName));
  }

  #restoreSession(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);

    const session = readStoredSession();
    if (!session) {
      this.#clearStoredSession();
      return;
    }
    this.#isSignedIn.set(true);
    this.#currentEmail.set(session.email);
    this.#currentUserId.set(session.userId);
    this.#currentRoleIds.set(session.roleIds);
  }

  #validateRestoredAccount(): void {
    const userId = this.#currentUserId();
    if (userId === null) {
      return;
    }
    this.#api.userAccountExists(userId).subscribe((exists) => {
      if (!exists) {
        this.signOut(this.#injector.get(Router));
      }
    });
  }

  #clearStoredSession(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }

  loadRoles(): void {
    this.#rolesLoaded.set(false);
    this.#api.getRoles().subscribe({
      next: (roles) => {
        this.#roles.set(roles);
        this.#rolesLoaded.set(true);
      },
      error: () => {
        this.#roles.set([]);
        this.#rolesLoaded.set(true);
      },
    });
  }

  roleById(id: number): Role | undefined {
    return this.#roles().find((role) => role.id === id);
  }

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
        sessionStorage.setItem(TOKEN_STORAGE_KEY, resource.token);
        const session: StoredSession = { email: resource.email, userId: resource.id, roleIds: resource.roleIds };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        this.#isSignedIn.set(true);
        this.#currentEmail.set(resource.email);
        this.#currentUserId.set(resource.id);
        this.#currentRoleIds.set(resource.roleIds);
        if (this.#roles().length === 0) {
          this.loadRoles();
        }
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
    this.#clearStoredSession();
    this.#isSignedIn.set(false);
    this.#currentEmail.set(null);
    this.#currentUserId.set(null);
    this.#currentRoleIds.set([]);
    router.navigate(['/identity/sign-in']).then();
  }
}
