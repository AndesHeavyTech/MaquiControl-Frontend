import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { IdentityAccessStore } from '../../../../identity-access-management/application/identity-access-store';
import { FleetManagementStore } from '../../../application/fleet-management-store';
import { Machinery } from '../../../domain/model/machinery.entity';
import { MachineryLocation } from '../../../domain/model/machinery-location.value-object';
import { MachineryStatus } from '../../../domain/model/machinery-status';
import { MachineryType } from '../../../domain/model/machinery-type';
import { Currency, Money } from '../../../domain/model/money.value-object';

/** A new machinery's id is assigned by the backend; `json-server` ignores
 *  whatever id is sent on create, ours just satisfies Machinery's
 *  constructor until the real one comes back in the response. */
const DRAFT_ENTITY_ID = 1;

@Component({
  selector: 'app-machinery-form',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule],
  templateUrl: './machinery-form.html',
  styleUrl: './machinery-form.scss',
})
export class MachineryForm implements OnInit {
  protected readonly store = inject(FleetManagementStore);
  readonly #identityAccessStore = inject(IdentityAccessStore);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  protected editingId: number | null = null;

  protected readonly machineryTypes = Object.values(MachineryType);
  protected readonly machineryStatuses = Object.values(MachineryStatus);
  protected readonly currencies: Currency[] = ['PEN', 'USD'];

  protected readonly form = new FormGroup({
    categoryId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<MachineryType>(MachineryType.Excavator, { nonNullable: true }),
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
      type: machinery.type,
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

  protected performSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const machinery = new Machinery({
      id: this.editingId ?? DRAFT_ENTITY_ID,
      ownerProfileId: this.#identityAccessStore.currentUserId() ?? DRAFT_ENTITY_ID,
      categoryId: value.categoryId!,
      name: value.name,
      description: value.description,
      type: value.type,
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
