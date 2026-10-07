import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, retry } from 'rxjs';
import { Category } from '../domain/model/category.entity';
import { Machinery } from '../domain/model/machinery.entity';
import { FleetManagementApi } from '../infrastructure/fleet-management-api';

@Injectable({
  providedIn: 'root',
})
export class FleetManagementStore {
  readonly #api = inject(FleetManagementApi);

  readonly #machinery = signal<Machinery[]>([]);
  readonly #categories = signal<Category[]>([]);
  readonly #loading = signal(false);
  readonly #error = signal<string | null>(null);
  readonly #saving = signal(false);
  readonly #saveError = signal<string | null>(null);

  readonly machinery = this.#machinery.asReadonly();
  readonly categories = this.#categories.asReadonly();
  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly saving = this.#saving.asReadonly();
  readonly saveError = this.#saveError.asReadonly();

  readonly machineryCount = computed(() => this.#machinery().length);

  readonly availableMachineryCount = computed(
    () => this.#machinery().filter((machinery) => machinery.isAvailable()).length,
  );

  constructor() {
    this.loadMachinery();
    this.loadCategories();
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

  loadCategories(): void {
    this.#api
      .getCategories()
      .pipe(retry(2))
      .subscribe({
        next: (categories) => this.#categories.set(categories),
        error: () => this.#categories.set([]),
      });
  }

  machineryById(id: number): Machinery | undefined {
    return this.#machinery().find((machinery) => machinery.id === id);
  }

  categoryById(id: number): Category | undefined {
    return this.#categories().find((category) => category.id === id);
  }


  createMachinery(machinery: Machinery, onSuccess: () => void): void {
    this.#saving.set(true);
    this.#saveError.set(null);

    this.#api
      .createMachinery(machinery)
      .pipe(finalize(() => this.#saving.set(false)))
      .subscribe({
        next: (created) => {
          this.#machinery.set([...this.#machinery(), created]);
          onSuccess();
        },
        error: (error: Error) => this.#saveError.set(error.message),
      });
  }

  updateMachinery(machinery: Machinery, id: number, onSuccess: () => void): void {
    this.#saving.set(true);
    this.#saveError.set(null);

    this.#api
      .updateMachinery(machinery, id)
      .pipe(finalize(() => this.#saving.set(false)))
      .subscribe({
        next: (updated) => {
          this.#machinery.set(this.#machinery().map((item) => (item.id === id ? updated : item)));
          onSuccess();
        },
        error: (error: Error) => this.#saveError.set(error.message),
      });
  }

  deleteMachinery(id: number): void {
    this.#saveError.set(null);

    this.#api.deleteMachinery(id).subscribe({
      next: () => this.#machinery.set(this.#machinery().filter((item) => item.id !== id)),
      error: (error: Error) => this.#saveError.set(error.message),
    });
  }
}
