import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, retry } from 'rxjs';
import { Machinery } from '../domain/model/machinery.entity';
import { FleetManagementApi } from '../infrastructure/fleet-management-api';

@Injectable({
  providedIn: 'root',
})
export class FleetManagementStore {
  readonly #api = inject(FleetManagementApi);

  readonly #machinery = signal<Machinery[]>([]);
  readonly #loading = signal(false);
  readonly #error = signal<string | null>(null);

  readonly machinery = this.#machinery.asReadonly();
  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();

  readonly machineryCount = computed(() => this.#machinery().length);

  readonly availableMachineryCount = computed(
    () => this.#machinery().filter((machinery) => machinery.isAvailable()).length,
  );

  constructor() {
    this.loadMachinery();
  }

  loadMachinery(): void {
    this.#loading.set(true);
    this.#error.set(null);

    this.#api
      .getMachinery()
      .pipe(
        retry(2),
        finalize(() => this.#loading.set(false)),
      )
      .subscribe({
        next: (machinery) => this.#machinery.set(machinery),
        error: (error: Error) => {
          this.#machinery.set([]);
          this.#error.set(error.message);
        },
      });
  }
}
