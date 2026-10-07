import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityAccessApi } from '../infrastructure/identity-access-api';
import { Role } from '../domain/model/role.entity';
import { RoleName } from '../domain/model/role-name';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';

const TOKEN_STORAGE_KEY = 'mc-token';
const SESSION_STORAGE_KEY = 'mc-session';

/**
 * What survives a page reload next to the token: without it a refresh would
 * find `isSignedIn` back at `false` and send the user to the sign-in page.
 *
 * Kept in `sessionStorage`, not `localStorage`: it survives a reload (F5)
 * but is discarded when the tab or browser is closed, so reopening the app
 * always starts signed out.
 */
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
  /**
   * `Router` is read lazily: injecting it here creates a cycle at startup
   * (Router -> title strategy -> translations HTTP request -> auth
   * interceptor -> this store -> Router).
   */
  readonly #injector = inject(Injector);

  readonly #isSignedIn = signal(false);
  readonly #currentEmail = signal<string | null>(null);
  readonly #currentUserId = signal<number | null>(null);
  readonly #currentRoleIds = signal<number[]>([]);
  readonly #roles = signal<Role[]>([]);
  readonly #submitting = signal(false);
  readonly #error = signal<string | null>(null);

  readonly isSignedIn = this.#isSignedIn.asReadonly();
  readonly currentEmail = this.#currentEmail.asReadonly();
  readonly currentUserId = this.#currentUserId.asReadonly();
  readonly currentRoleIds = this.#currentRoleIds.asReadonly();
  readonly roles = this.#roles.asReadonly();
  readonly submitting = this.#submitting.asReadonly();
  readonly error = this.#error.asReadonly();

  readonly currentToken = computed(() =>
    this.isSignedIn() ? sessionStorage.getItem(TOKEN_STORAGE_KEY) : null,
  );

  /**
   * Roles are platform-defined reference data (see `RoleName`): loaded
   * once, independently of sign-in, so they are available as soon as a
   * `UserAccount`'s `roleIds` need to be labeled anywhere in the UI.
   */
  readonly currentRoles = computed(() =>
    this.#currentRoleIds()
      .map((id) => this.roleById(id))
      .filter((role): role is Role => role !== undefined),
  );

  constructor() {
    this.#restoreSession();

    // HTTP calls go through `identityAccessInterceptor`, which injects this
    // store: issued inside the constructor they fail with a circular
    // dependency (NG0200), so they wait until construction has finished.
    queueMicrotask(() => {
      this.#validateRestoredAccount();
      this.loadRoles();
    });
  }

  hasRole(roleName: RoleName): boolean {
    return this.currentRoles().some((role) => role.name === roleName);
  }

  #restoreSession(): void {
    // Sessions saved by earlier versions in `localStorage` would never expire.
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

  /** The account may have been deleted since the session was saved (e.g. the fake API was reseeded). */
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
    this.#api.getRoles().subscribe({
      next: (roles) => this.#roles.set(roles),
      error: () => this.#roles.set([]),
    });
  }

  roleById(id: number): Role | undefined {
    return this.#roles().find((role) => role.id === id);
  }

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
        sessionStorage.setItem(TOKEN_STORAGE_KEY, resource.token);
        const session: StoredSession = { email: resource.email, userId: resource.id, roleIds: resource.roleIds };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
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
    this.#clearStoredSession();
    this.#isSignedIn.set(false);
    this.#currentEmail.set(null);
    this.#currentUserId.set(null);
    this.#currentRoleIds.set([]);
    router.navigate(['/identity/sign-in']).then();
  }
}
