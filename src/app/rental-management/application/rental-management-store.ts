import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, retry } from 'rxjs';
import { ProfilesManagementStore } from '../../profiles-management/application/profiles-management-store';
import { Rental } from '../domain/model/rental.entity';
import { RentalPeriod } from '../domain/model/rental-period.value-object';
import { RentalStatus } from '../domain/model/rental-status';
import { RentalManagementApi } from '../infrastructure/rental-management-api';

const BLOCKING_STATUSES: RentalStatus[] = [
  RentalStatus.Requested,
  RentalStatus.Confirmed,
  RentalStatus.InProgress,
];

@Injectable({
  providedIn: 'root',
})
export class RentalManagementStore {
  readonly #api = inject(RentalManagementApi);
  readonly #profilesManagementStore = inject(ProfilesManagementStore);

  readonly #rentals = signal<Rental[]>([]);
  readonly #loading = signal(false);
  readonly #error = signal<string | null>(null);
  readonly #saving = signal(false);
  readonly #saveError = signal<string | null>(null);

  readonly rentals = this.#rentals.asReadonly();
  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly saving = this.#saving.asReadonly();
  readonly saveError = this.#saveError.asReadonly();

  readonly myReservations = computed(() => {
    const profile = this.#profilesManagementStore.currentProfile();

    if (!profile) {
      return [];
    }

    return this.#rentals().filter((rental) => rental.contractorProfileId === profile.id);
  });

  readonly pendingRequestsCount = computed(
    () => this.#rentals().filter((rental) => rental.isPending()).length,
  );

  constructor() {
    this.loadRentals();
  }

  loadRentals(): void {
    this.#loading.set(true);
    this.#error.set(null);

    this.#api
      .getRentals()
      .pipe(
        retry(2),
        finalize(() => this.#loading.set(false)),
      )
      .subscribe({
        next: (rentals) => this.#rentals.set(rentals),
        error: (error: Error) => {
          this.#rentals.set([]);
          this.#error.set(error.message);
        },
      });
  }

  rentalsForMachinery(machineryId: number): Rental[] {
    return this.#rentals().filter((rental) => rental.machineryId === machineryId);
  }

  /**
   * Mirrors `RentalRepository.existsOverlappingRental()` from the class
   * diagram, enforcing US-005 (evitar reservas duplicadas): a client-side
   * check against what's already loaded, same simplification already
   * used for `nextMachineryId()`/`nextProfileId()` — one json-server
   * instance, no concurrent-write race to guard against here.
   */
  hasOverlappingActiveRental(machineryId: number, period: RentalPeriod): boolean {
    return this.rentalsForMachinery(machineryId).some(
      (rental) => BLOCKING_STATUSES.includes(rental.status) && rental.period.overlaps(period),
    );
  }

  /**
   * Create is never retried automatically, same reasoning as every other
   * mutating call in this app (`FleetManagementStore`, `IdentityAccessStore`,
   * `ProfilesManagementStore`): retrying after a transient failure could
   * duplicate the request.
   */
  requestRental(rental: Rental, onSuccess: () => void): void {
    this.#saving.set(true);
    this.#saveError.set(null);

    this.#api
      .createRental(rental)
      .pipe(finalize(() => this.#saving.set(false)))
      .subscribe({
        next: (created) => {
          this.#rentals.set([...this.#rentals(), created]);
          onSuccess();
        },
        error: (error: Error) => this.#saveError.set(error.message),
      });
  }

  confirmReservation(rental: Rental): void {
    this.#saveError.set(null);

    const confirmed = new Rental({
      id: rental.id,
      machineryId: rental.machineryId,
      contractorProfileId: rental.contractorProfileId,
      period: rental.period,
      status: RentalStatus.Confirmed,
      totalAmount: rental.totalAmount,
      cancellationReason: null,
      requestedAt: rental.requestedAt,
      confirmedAt: new Date(),
      cancelledAt: null,
    });

    this.#api.updateRental(confirmed, rental.id).subscribe({
      next: (updated) =>
        this.#rentals.set(this.#rentals().map((item) => (item.id === updated.id ? updated : item))),
      error: (error: Error) => this.#saveError.set(error.message),
    });
  }

  cancelReservation(rental: Rental, reason: string): void {
    this.#saveError.set(null);

    const cancelled = new Rental({
      id: rental.id,
      machineryId: rental.machineryId,
      contractorProfileId: rental.contractorProfileId,
      period: rental.period,
      status: RentalStatus.Cancelled,
      totalAmount: rental.totalAmount,
      cancellationReason: reason,
      requestedAt: rental.requestedAt,
      confirmedAt: rental.confirmedAt,
      cancelledAt: new Date(),
    });

    this.#api.updateRental(cancelled, rental.id).subscribe({
      next: (updated) =>
        this.#rentals.set(this.#rentals().map((item) => (item.id === updated.id ? updated : item))),
      error: (error: Error) => this.#saveError.set(error.message),
    });
  }
}
