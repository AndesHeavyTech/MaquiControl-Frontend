import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, retry } from 'rxjs';
import { OperationStatus } from '../domain/model/operation-status';
import { ServiceOperation } from '../domain/model/service-operation.entity';
import { WorkedHours } from '../domain/model/worked-hours.entity';
import { WorkedHoursStatus } from '../domain/model/worked-hours-status';
import { OperationsManagementApi } from '../infrastructure/operations-management-api';

@Injectable({
  providedIn: 'root',
})
export class OperationsManagementStore {
  readonly #api = inject(OperationsManagementApi);

  readonly #operations = signal<ServiceOperation[]>([]);
  readonly #loading = signal(false);
  readonly #error = signal<string | null>(null);
  readonly #saving = signal(false);
  readonly #saveError = signal<string | null>(null);

  readonly operations = this.#operations.asReadonly();
  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly saving = this.#saving.asReadonly();
  readonly saveError = this.#saveError.asReadonly();

  readonly inProgressCount = computed(
    () => this.#operations().filter((operation) => operation.isInProgress()).length,
  );

  constructor() {
    this.loadOperations();
  }

  loadOperations(): void {
    this.#loading.set(true);
    this.#error.set(null);

    this.#api
      .getServiceOperations()
      .pipe(
        retry(2),
        finalize(() => this.#loading.set(false)),
      )
      .subscribe({
        next: (operations) => this.#operations.set(operations),
        error: (error: Error) => {
          this.#operations.set([]);
          this.#error.set(error.message);
        },
      });
  }

  operationByRentalId(rentalId: number): ServiceOperation | undefined {
    return this.#operations().find((operation) => operation.rentalId === rentalId);
  }

  private nextOperationId(): number {
    const existingIds = this.#operations().map((operation) => operation.id);
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  }

  private nextWorkedHoursId(operation: ServiceOperation): number {
    const existingIds = operation.workedHours.map((record) => record.id);
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  }

  /** US-010 is triggered the first time hours are recorded for a rental
   *  with no `ServiceOperation` yet: starting the operation and recording
   *  the first entry happen together, same simplification already used
   *  for `MaintenanceManagementStore.reportBreakdown()`. */
  startOperation(rentalId: number, machineryId: number, onSuccess: (created: ServiceOperation) => void): void {
    this.#saving.set(true);
    this.#saveError.set(null);

    const operation = new ServiceOperation({
      id: this.nextOperationId(),
      rentalId,
      machineryId,
      operatorProfileId: null,
      status: OperationStatus.InProgress,
      startedAt: new Date(),
      completedAt: null,
      workedHours: [],
    });

    this.#api
      .createServiceOperation(operation)
      .pipe(finalize(() => this.#saving.set(false)))
      .subscribe({
        next: (created) => {
          this.#operations.set([...this.#operations(), created]);
          onSuccess(created);
        },
        error: (error: Error) => this.#saveError.set(error.message),
      });
  }

  /** US-010 "Registrar horas trabajadas": appends a PENDING entry that
   *  the owner must later validate (US-011). */
  recordWorkedHours(
    operation: ServiceOperation,
    record: { workDate: Date; startTime: string; endTime: string; totalHours: number; observations: string | null },
  ): void {
    this.#saveError.set(null);

    const workedHours = new WorkedHours({
      id: this.nextWorkedHoursId(operation),
      workDate: record.workDate,
      startTime: record.startTime,
      endTime: record.endTime,
      totalHours: record.totalHours,
      status: WorkedHoursStatus.Pending,
      observations: record.observations,
    });

    const updated = new ServiceOperation({
      id: operation.id,
      rentalId: operation.rentalId,
      machineryId: operation.machineryId,
      operatorProfileId: operation.operatorProfileId,
      status: operation.status,
      startedAt: operation.startedAt,
      completedAt: operation.completedAt,
      workedHours: [...operation.workedHours, workedHours],
    });

    this.persist(updated);
  }

  /** US-011 "Validar horas trabajadas": the owner approves or rejects one
   *  pending entry. */
  validateWorkedHours(operation: ServiceOperation, workedHoursId: number, approve: boolean): void {
    this.#saveError.set(null);

    const updated = new ServiceOperation({
      id: operation.id,
      rentalId: operation.rentalId,
      machineryId: operation.machineryId,
      operatorProfileId: operation.operatorProfileId,
      status: operation.status,
      startedAt: operation.startedAt,
      completedAt: operation.completedAt,
      workedHours: operation.workedHours.map((record) =>
        record.id === workedHoursId
          ? new WorkedHours({
              id: record.id,
              workDate: record.workDate,
              startTime: record.startTime,
              endTime: record.endTime,
              totalHours: record.totalHours,
              status: approve ? WorkedHoursStatus.Validated : WorkedHoursStatus.Rejected,
              observations: record.observations,
            })
          : record,
      ),
    });

    this.persist(updated);
  }

  completeOperation(operation: ServiceOperation): void {
    this.#saveError.set(null);

    const updated = new ServiceOperation({
      id: operation.id,
      rentalId: operation.rentalId,
      machineryId: operation.machineryId,
      operatorProfileId: operation.operatorProfileId,
      status: OperationStatus.Completed,
      startedAt: operation.startedAt,
      completedAt: new Date(),
      workedHours: operation.workedHours,
    });

    this.persist(updated);
  }

  private persist(operation: ServiceOperation): void {
    this.#api.updateServiceOperation(operation, operation.id).subscribe({
      next: (updated) =>
        this.#operations.set(
          this.#operations().map((item) => (item.id === updated.id ? updated : item)),
        ),
      error: (error: Error) => this.#saveError.set(error.message),
    });
  }
}
