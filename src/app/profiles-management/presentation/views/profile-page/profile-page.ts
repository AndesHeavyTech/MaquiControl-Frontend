import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { IdentityAccessStore } from '../../../../identity-access-management/application/identity-access-store';
import { ProfilesManagementStore } from '../../../application/profiles-management-store';
import { ContactInformation } from '../../../domain/model/contact-information.value-object';
import { Profile } from '../../../domain/model/profile.entity';
import { OrganizationForm } from '../organization-form/organization-form';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, MatButtonModule, OrganizationForm, TranslatePipe],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  protected readonly store = inject(ProfilesManagementStore);
  protected readonly identityAccessStore = inject(IdentityAccessStore);
  readonly #router = inject(Router);

  private formPatched = false;

  protected readonly form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    documentNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    secondaryEmail: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    district: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly justSaved = signal(false);

  constructor() {
    effect(() => {
      const profile = this.store.currentProfile();

      if (profile && !this.formPatched) {
        this.form.setValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          documentNumber: profile.documentNumber,
          phoneNumber: profile.contactInformation.phoneNumber,
          secondaryEmail: profile.contactInformation.secondaryEmail ?? '',
          address: profile.contactInformation.address,
          district: profile.contactInformation.district,
          city: profile.contactInformation.city,
        });
        this.formPatched = true;
      }
    });
  }

  private nextProfileId(): number {
    const existingIds = this.store.profiles().map((profile) => profile.id);
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  }

  protected performSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const existingProfile = this.store.currentProfile();

    const profile = new Profile({
      id: existingProfile?.id ?? this.nextProfileId(),
      userAccountId: this.identityAccessStore.currentUserId()!,
      organizationId: existingProfile?.organizationId ?? null,
      firstName: value.firstName,
      lastName: value.lastName,
      documentNumber: value.documentNumber,
      contactInformation: new ContactInformation({
        phoneNumber: value.phoneNumber,
        secondaryEmail: value.secondaryEmail || null,
        address: value.address,
        district: value.district,
        city: value.city,
      }),
      createdAt: existingProfile?.createdAt ?? new Date(),
      updatedAt: new Date(),
    });

    this.justSaved.set(false);

    this.store.saveProfile(profile, () => this.justSaved.set(true));
  }

  protected performSignOut(): void {
    this.identityAccessStore.signOut(this.#router);
  }
}
