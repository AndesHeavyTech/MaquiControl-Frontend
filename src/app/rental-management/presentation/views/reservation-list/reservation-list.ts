import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FleetManagementStore } from '../../../../fleet-management/application/fleet-management-store';
import { ProfilesManagementStore } from '../../../../profiles-management/application/profiles-management-store';
import { RentalManagementStore } from '../../../application/rental-management-store';
import { Rental } from '../../../domain/model/rental.entity';
import { RentalStatus } from '../../../domain/model/rental-status';

@Component({
  selector: 'app-reservation-list',
  imports: [DatePipe, DecimalPipe, RouterLink, MatButtonModule],
  templateUrl: './reservation-list.html',
  styleUrl: './reservation-list.scss',
})
export class ReservationList {
  protected readonly store = inject(RentalManagementStore);
  readonly #fleetManagementStore = inject(FleetManagementStore);
  readonly #profilesManagementStore = inject(ProfilesManagementStore);

  protected machineryName(machineryId: number): string {
    return this.#fleetManagementStore.machineryById(machineryId)?.name ?? `Maquinaria #${machineryId}`;
  }

  /**
   * US-019 "Aprobar o rechazar reservas" is the fleet owner's job, not the
   * contractor who made the request: confirming/rejecting is only offered
   * to whoever owns the machinery being reserved (`Machinery.ownerProfileId`
   * matching the signed-in user's own `Profile.id`), never to the
   * requester themselves.
   */
  protected isMachineryOwner(rental: Rental): boolean {
    const profile = this.#profilesManagementStore.currentProfile();
    const machinery = this.#fleetManagementStore.machineryById(rental.machineryId);

    return !!profile && !!machinery && machinery.ownerProfileId === profile.id;
  }

  /** The contractor who requested this specific rental. */
  protected isRequester(rental: Rental): boolean {
    const profile = this.#profilesManagementStore.currentProfile();

    return !!profile && rental.contractorProfileId === profile.id;
  }

  protected rentalStatusLabel(status: RentalStatus): string {
    const labels: Record<RentalStatus, string> = {
      [RentalStatus.Requested]: 'Solicitada',
      [RentalStatus.Confirmed]: 'Confirmada',
      [RentalStatus.InProgress]: 'En curso',
      [RentalStatus.Completed]: 'Finalizada',
      [RentalStatus.Cancelled]: 'Cancelada',
    };

    return labels[status];
  }

  protected rentalStatusClass(status: RentalStatus): string {
    return status.toLowerCase().replaceAll('_', '-');
  }

  protected performConfirm(rental: Rental): void {
    this.store.confirmReservation(rental);
  }

  protected performCancel(rental: Rental): void {
    const reason = prompt('Motivo de la cancelación:');

    if (reason === null || reason.trim().length === 0) {
      return;
    }

    this.store.cancelReservation(rental, reason.trim());
  }
}
