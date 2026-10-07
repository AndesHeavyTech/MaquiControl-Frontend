import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ProfilesManagementStore } from '../../../../profiles-management/application/profiles-management-store';
import { RentalManagementStore } from '../../../../rental-management/application/rental-management-store';
import { FleetManagementStore } from '../../../../fleet-management/application/fleet-management-store';
import { OperationsManagementStore } from '../../../application/operations-management-store';
import { WorkedHours } from '../../../domain/model/worked-hours.entity';
import { WorkedHoursStatus } from '../../../domain/model/worked-hours-status';
import { WorkedHoursForm, WorkedHoursSubmission } from '../worked-hours-form/worked-hours-form';

@Component({
  selector: 'app-service-operation-page',
  imports: [DatePipe, DecimalPipe, RouterLink, MatButtonModule, WorkedHoursForm],
  templateUrl: './service-operation-page.html',
  styleUrl: './service-operation-page.scss',
})
export class ServiceOperationPage implements OnInit {
  protected readonly store = inject(OperationsManagementStore);
  protected readonly rentalStore = inject(RentalManagementStore);
  protected readonly fleetManagementStore = inject(FleetManagementStore);
  readonly #profilesManagementStore = inject(ProfilesManagementStore);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  protected rentalId = 0;

  ngOnInit(): void {
    this.rentalId = Number(this.#route.snapshot.paramMap.get('rentalId'));

    if (!this.rental) {
      this.#router.navigate(['/rental/reservations']).then();
    }
  }

  protected get rental() {
    return this.rentalStore.rentals().find((item) => item.id === this.rentalId);
  }

  protected get operation() {
    return this.store.operationByRentalId(this.rentalId);
  }

  /** US-011: validating is the machinery owner's job, same ownership
   *  pattern already used for confirming/rejecting a rental. */
  protected get isMachineryOwner(): boolean {
    const profile = this.#profilesManagementStore.currentProfile();
    const machinery = this.rental && this.fleetManagementStore.machineryById(this.rental.machineryId);

    return !!profile && !!machinery && machinery.ownerProfileId === profile.id;
  }

  /** US-010: recording hours is the contractor's job, as the one actually
   *  operating the rented machine in the field. */
  protected get isContractor(): boolean {
    const profile = this.#profilesManagementStore.currentProfile();
    return !!profile && !!this.rental && this.rental.contractorProfileId === profile.id;
  }

  protected workedHoursStatusLabel(status: WorkedHoursStatus): string {
    const labels: Record<WorkedHoursStatus, string> = {
      [WorkedHoursStatus.Pending]: 'Pendiente',
      [WorkedHoursStatus.Validated]: 'Validada',
      [WorkedHoursStatus.Rejected]: 'Rechazada',
    };

    return labels[status];
  }

  protected performStart(): void {
    if (!this.rental) {
      return;
    }

    this.store.startOperation(this.rental.id, this.rental.machineryId, () => {});
  }

  protected performRecord(submission: WorkedHoursSubmission): void {
    const operation = this.operation;

    if (!operation) {
      return;
    }

    this.store.recordWorkedHours(operation, submission);
  }

  protected performValidate(record: WorkedHours, approve: boolean): void {
    const operation = this.operation;

    if (!operation) {
      return;
    }

    this.store.validateWorkedHours(operation, record.id, approve);
  }

  protected performComplete(): void {
    const operation = this.operation;

    if (!operation) {
      return;
    }

    this.store.completeOperation(operation);
  }
}
