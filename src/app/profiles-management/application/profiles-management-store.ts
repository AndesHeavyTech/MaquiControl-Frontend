import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, retry } from 'rxjs';
import { IdentityAccessStore } from '../../identity-access-management/application/identity-access-store';
import { Organization } from '../domain/model/organization.entity';
import { Profile } from '../domain/model/profile.entity';
import { ProfilesManagementApi } from '../infrastructure/profiles-management-api';

@Injectable({
  providedIn: 'root',
})
export class ProfilesManagementStore {
  readonly #api = inject(ProfilesManagementApi);
  readonly #identityAccessStore = inject(IdentityAccessStore);

  readonly #profiles = signal<Profile[]>([]);
  readonly #organizations = signal<Organization[]>([]);
  readonly #loading = signal(false);
  readonly #error = signal<string | null>(null);
  readonly #saving = signal(false);
  readonly #saveError = signal<string | null>(null);

  readonly profiles = this.#profiles.asReadonly();
  readonly organizations = this.#organizations.asReadonly();
  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly saving = this.#saving.asReadonly();
  readonly saveError = this.#saveError.asReadonly();

  readonly currentProfile = computed(() =>
    this.#profiles().find(
      (profile) => profile.userAccountId === this.#identityAccessStore.currentUserId(),
    ),
  );

  readonly currentOrganization = computed(() => {
    const profile = this.currentProfile();

    if (!profile || profile.organizationId === null) {
      return null;
    }

    return this.#organizations().find((organization) => organization.id === profile.organizationId) ?? null;
  });

  constructor() {
    this.loadProfiles();
    this.loadOrganizations();
  }

  loadProfiles(): void {
    this.#loading.set(true);
    this.#error.set(null);

    this.#api
      .getProfiles()
      .pipe(
        retry(2),
        finalize(() => this.#loading.set(false)),
      )
      .subscribe({
        next: (profiles) => this.#profiles.set(profiles),
        error: (error: Error) => {
          this.#profiles.set([]);
          this.#error.set(error.message);
        },
      });
  }

  loadOrganizations(): void {
    this.#api
      .getOrganizations()
      .pipe(retry(2))
      .subscribe({
        next: (organizations) => this.#organizations.set(organizations),
        error: () => this.#organizations.set([]),
      });
  }

  saveProfile(profile: Profile, onSuccess: () => void): void {
    this.#saving.set(true);
    this.#saveError.set(null);

    const existingProfile = this.currentProfile();
    const request = existingProfile
      ? this.#api.updateProfile(profile, existingProfile.id)
      : this.#api.createProfile(profile);

    request.pipe(finalize(() => this.#saving.set(false))).subscribe({
      next: (saved) => {
        this.#profiles.set(
          existingProfile
            ? this.#profiles().map((item) => (item.id === saved.id ? saved : item))
            : [...this.#profiles(), saved],
        );
        onSuccess();
      },
      error: (error: Error) => this.#saveError.set(error.message),
    });
  }

  saveOrganization(organization: Organization, onSuccess: () => void): void {
    this.#saving.set(true);
    this.#saveError.set(null);

    const existingOrganization = this.currentOrganization();
    const request = existingOrganization
      ? this.#api.updateOrganization(organization, existingOrganization.id)
      : this.#api.createOrganization(organization);

    request.pipe(finalize(() => this.#saving.set(false))).subscribe({
      next: (saved) => {
        this.#organizations.set(
          existingOrganization
            ? this.#organizations().map((item) => (item.id === saved.id ? saved : item))
            : [...this.#organizations(), saved],
        );

        const profile = this.currentProfile();

        if (profile && profile.organizationId !== saved.id) {
          this.linkOrganizationToProfile(profile, saved.id, onSuccess);
          return;
        }

        onSuccess();
      },
      error: (error: Error) => this.#saveError.set(error.message),
    });
  }

  private linkOrganizationToProfile(profile: Profile, organizationId: number, onSuccess: () => void): void {
    const linkedProfile = new Profile({
      id: profile.id,
      userAccountId: profile.userAccountId,
      organizationId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      documentNumber: profile.documentNumber,
      contactInformation: profile.contactInformation,
      createdAt: profile.createdAt,
      updatedAt: new Date(),
    });

    this.#api.updateProfile(linkedProfile, profile.id).subscribe({
      next: (saved) => {
        this.#profiles.set(this.#profiles().map((item) => (item.id === saved.id ? saved : item)));
        onSuccess();
      },
      error: (error: Error) => this.#saveError.set(error.message),
    });
  }
}
