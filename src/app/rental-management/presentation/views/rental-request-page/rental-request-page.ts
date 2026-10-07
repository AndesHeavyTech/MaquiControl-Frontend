import { DecimalPipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { FleetManagementStore } from '../../../../fleet-management/application/fleet-management-store';
import { ProfilesManagementStore } from '../../../../profiles-management/application/profiles-management-store';
import { RentalManagementStore } from '../../../application/rental-management-store';
import { Money } from '../../../domain/model/money.value-object';
import { Rental } from '../../../domain/model/rental.entity';
import { RentalPeriod } from '../../../domain/model/rental-period.value-object';
import { RentalStatus } from '../../../domain/model/rental-status';

function notBeforeToday(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && control.value < RentalPeriod.todayIsoDate() ? { pastDate: true } : null;
}

function endNotBeforeStart(group: AbstractControl): ValidationErrors | null {
  const { startDate, endDate } = group.value as { startDate: string; endDate: string };
  return startDate && endDate && endDate < startDate ? { endBeforeStart: true } : null;
}

@Component({
  selector: 'app-rental-request-page',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, DecimalPipe, TranslatePipe],
  templateUrl: './rental-request-page.html',
  styleUrl: './rental-request-page.scss',
})
export class RentalRequestPage {
  protected readonly store = inject(RentalManagementStore);
  protected readonly fleetManagementStore = inject(FleetManagementStore);
  readonly #profilesManagementStore = inject(ProfilesManagementStore);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  protected readonly machineryId = Number(this.#route.snapshot.paramMap.get('machineryId'));
  protected readonly today = RentalPeriod.todayIsoDate();
  protected overlapDetected = false;

  protected readonly form = new FormGroup(
    {
      startDate: new FormControl('', { nonNullable: true, validators: [Validators.required, notBeforeToday] }),
      endDate: new FormControl('', { nonNullable: true, validators: [Validators.required, notBeforeToday] }),
    },
    { validators: endNotBeforeStart },
  );

  constructor() {
    effect(() => {
      if (!this.fleetManagementStore.loading() && !this.fleetManagementStore.machineryById(this.machineryId)) {
        this.#router.navigate(['/fleet/machinery']).then();
      }
    });
  }

  protected get machinery() {
    return this.fleetManagementStore.machineryById(this.machineryId);
  }

  protected get profileExists(): boolean {
    return !!this.#profilesManagementStore.currentProfile();
  }

  protected estimatedTotal(): Money | null {
    const machinery = this.machinery;
    const period = this.buildPeriod();

    if (!machinery || !period) {
      return null;
    }

    return Rental.estimateTotal(
      period,
      new Money({ amount: machinery.hourlyRate.amount, currency: machinery.hourlyRate.currency }),
    );
  }

  private buildPeriod(): RentalPeriod | null {
    const { startDate, endDate } = this.form.getRawValue();

    if (!startDate || !endDate || this.form.invalid) {
      return null;
    }

    try {
      return RentalPeriod.fromIsoDates(startDate, endDate);
    } catch {
      return null;
    }
  }

  private nextRentalId(): number {
    const existingIds = this.store.rentals().map((rental) => rental.id);
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  }

  protected performRequest(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const machinery = this.machinery;
    const profile = this.#profilesManagementStore.currentProfile();
    const period = this.buildPeriod();

    if (!machinery || !machinery.isAvailable() || !profile || !period) {
      return;
    }

    this.overlapDetected = this.store.hasOverlappingActiveRental(this.machineryId, period);

    if (this.overlapDetected) {
      return;
    }

    const totalAmount = Rental.estimateTotal(
      period,
      new Money({ amount: machinery.hourlyRate.amount, currency: machinery.hourlyRate.currency }),
    );

    const rental = new Rental({
      id: this.nextRentalId(),
      machineryId: this.machineryId,
      contractorProfileId: profile.id,
      period,
      status: RentalStatus.Requested,
      totalAmount,
      cancellationReason: null,
      requestedAt: new Date(),
      confirmedAt: null,
      cancelledAt: null,
    });

    this.store.requestRental(rental, () => this.#router.navigate(['/rental/reservations']).then());
  }
}
