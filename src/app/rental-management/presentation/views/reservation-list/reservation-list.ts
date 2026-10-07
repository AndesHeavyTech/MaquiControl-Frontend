import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FleetManagementStore } from '../../../../fleet-management/application/fleet-management-store';
import { ProfilesManagementStore } from '../../../../profiles-management/application/profiles-management-store';
import { RentalManagementStore } from '../../../application/rental-management-store';
import { Rental } from '../../../domain/model/rental.entity';
import { RentalStatus } from '../../../domain/model/rental-status';

@Component({
  selector: 'app-reservation-list',
  imports: [DatePipe, DecimalPipe, RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './reservation-list.html',
  styleUrl: './reservation-list.scss',
})
export class ReservationList {
  protected readonly store = inject(RentalManagementStore);
  readonly #fleetManagementStore = inject(FleetManagementStore);
  readonly #profilesManagementStore = inject(ProfilesManagementStore);
  readonly #translate = inject(TranslateService);

  protected readonly myRentals = computed(() =>
    this.store.rentals().filter((rental) => this.isRequester(rental) || this.isMachineryOwner(rental)),
  );

  protected readonly myPendingCount = computed(
    () => this.myRentals().filter((rental) => rental.isPending()).length,
  );

  protected machineryName(machineryId: number): string {
    return this.#fleetManagementStore.machineryById(machineryId)?.name ?? this.#translate.instant('reservations.machinery-fallback', { id: machineryId });
  }

  protected isMachineryOwner(rental: Rental): boolean {
    const profile = this.#profilesManagementStore.currentProfile();
    const machinery = this.#fleetManagementStore.machineryById(rental.machineryId);

    return !!profile && !!machinery && machinery.ownerProfileId === profile.id;
  }

  protected isRequester(rental: Rental): boolean {
    const profile = this.#profilesManagementStore.currentProfile();

    return !!profile && rental.contractorProfileId === profile.id;
  }

  protected rentalStatusLabel(status: RentalStatus): string {
    return `enums.rental-status.${status}`;
  }

  protected rentalStatusClass(status: RentalStatus): string {
    return status.toLowerCase().replaceAll('_', '-');
  }

  protected performConfirm(rental: Rental): void {
    this.store.confirmReservation(rental);
  }

  protected performCancel(rental: Rental): void {
    const reason = prompt(this.#translate.instant('reservations.cancel-prompt'));

    if (reason === null || reason.trim().length === 0) {
      return;
    }

    this.store.cancelReservation(rental, reason.trim());
  }
}
