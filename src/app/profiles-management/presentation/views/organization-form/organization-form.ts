import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { ProfilesManagementStore } from '../../../application/profiles-management-store';
import { Organization } from '../../../domain/model/organization.entity';
import { OrganizationType } from '../../../domain/model/organization-type';

@Component({
  selector: 'app-organization-form',
  imports: [ReactiveFormsModule, MatButtonModule, TranslatePipe],
  templateUrl: './organization-form.html',
  styleUrl: './organization-form.scss',
})
export class OrganizationForm {
  protected readonly store = inject(ProfilesManagementStore);

  protected readonly organizationTypes = Object.values(OrganizationType);

  private formPatched = false;

  protected readonly form = new FormGroup({
    legalName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tradeName: new FormControl('', { nonNullable: true }),
    taxId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<OrganizationType>(OrganizationType.IndependentContractor, {
      nonNullable: true,
    }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly justSaved = signal(false);

  constructor() {
    effect(() => {
      const organization = this.store.currentOrganization();

      if (organization && !this.formPatched) {
        this.form.setValue({
          legalName: organization.legalName,
          tradeName: organization.tradeName ?? '',
          taxId: organization.taxId,
          type: organization.type,
          address: organization.address,
        });
        this.formPatched = true;
      }
    });
  }

  protected organizationTypeLabel(type: OrganizationType): string {
    return `enums.organization-type.${type}`;
  }

  /** Same reasoning as `ProfilePage.nextProfileId()`. */
  private nextOrganizationId(): number {
    const existingIds = this.store.organizations().map((organization) => organization.id);
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  }

  protected performSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const existingOrganization = this.store.currentOrganization();

    const organization = new Organization({
      id: existingOrganization?.id ?? this.nextOrganizationId(),
      legalName: value.legalName,
      tradeName: value.tradeName || null,
      taxId: value.taxId,
      type: value.type,
      address: value.address,
    });

    this.justSaved.set(false);

    this.store.saveOrganization(organization, () => this.justSaved.set(true));
  }
}
