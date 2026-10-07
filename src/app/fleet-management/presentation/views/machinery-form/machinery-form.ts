import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { ProfilesManagementStore } from '../../../../profiles-management/application/profiles-management-store';
import { FleetManagementStore } from '../../../application/fleet-management-store';
import { Machinery } from '../../../domain/model/machinery.entity';
import { MachineryLocation } from '../../../domain/model/machinery-location.value-object';
import { MachineryStatus } from '../../../domain/model/machinery-status';
import { Currency, Money } from '../../../domain/model/money.value-object';

@Component({
  selector: 'app-machinery-form',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './machinery-form.html',
  styleUrl: './machinery-form.scss',
})
export class MachineryForm implements OnInit {
  protected readonly store = inject(FleetManagementStore);
  readonly #profilesManagementStore = inject(ProfilesManagementStore);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  protected editingId: number | null = null;

  protected get profileExists(): boolean {
    return !!this.#profilesManagementStore.currentProfile();
  }

  protected readonly machineryStatuses = Object.values(MachineryStatus);
  protected readonly currencies: Currency[] = ['PEN', 'USD'];

  protected readonly form = new FormGroup({
    categoryId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    brand: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    model: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    manufactureYear: new FormControl(new Date().getFullYear(), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1900)],
    }),
    amount: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    currency: new FormControl<Currency>('PEN', { nonNullable: true }),
    status: new FormControl<MachineryStatus>(MachineryStatus.Available, { nonNullable: true }),
    department: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    province: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    district: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    const idParam = this.#route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    this.editingId = Number(idParam);
    const machinery = this.store.machineryById(this.editingId);

    if (!machinery) {
      this.#router.navigate(['/fleet/machinery']).then();
      return;
    }

    this.form.setValue({
      categoryId: machinery.categoryId,
      name: machinery.name,
      description: machinery.description,
      brand: machinery.brand,
      model: machinery.model,
      manufactureYear: machinery.manufactureYear,
      amount: machinery.hourlyRate.amount,
      currency: machinery.hourlyRate.currency,
      status: machinery.status,
      department: machinery.location.department,
      province: machinery.location.province,
      district: machinery.location.district,
      address: machinery.location.address,
    });
  }

  /**
   * `json-server` respects an id sent on create and throws a 500 if it
   * already exists in the collection (lodash-id's `insert()` rejects
   * duplicates) — it only auto-assigns one when none is sent. Since
   * `BaseAssembler`/`BaseResource` require every resource to carry an id,
   * we compute the next free one from what's already loaded instead of
   * leaving it out.
   */
  private nextMachineryId(): number {
    const existingIds = this.store.machinery().map((machinery) => machinery.id);
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  }

  protected performSave(): void {
    // `ownerProfileId` references Profiles Management's `Profile`, not the
    // signed-in `UserAccount` directly (per the Fleet Management database
    // diagram): without a profile there is no owner to publish under.
    const ownerProfile = this.#profilesManagementStore.currentProfile();
    if (this.form.invalid || !ownerProfile) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const machinery = new Machinery({
      id: this.editingId ?? this.nextMachineryId(),
      ownerProfileId: ownerProfile.id,
      categoryId: value.categoryId!,
      name: value.name,
      description: value.description,
      brand: value.brand,
      model: value.model,
      manufactureYear: value.manufactureYear,
      hourlyRate: new Money({ amount: value.amount, currency: value.currency }),
      status: value.status,
      location: new MachineryLocation({
        department: value.department,
        province: value.province,
        district: value.district,
        address: value.address,
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const goToCatalog = () => this.#router.navigate(['/fleet/machinery']).then();

    if (this.editingId) {
      this.store.updateMachinery(machinery, this.editingId, goToCatalog);
    } else {
      this.store.createMachinery(machinery, goToCatalog);
    }
  }
}
