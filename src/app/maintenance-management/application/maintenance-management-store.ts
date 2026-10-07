import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, retry } from 'rxjs';
import { BreakdownReport } from '../domain/model/breakdown-report.entity';
import { BreakdownSeverity } from '../domain/model/breakdown-severity';
import { Maintenance } from '../domain/model/maintenance.entity';
import { MaintenanceStatus } from '../domain/model/maintenance-status';
import { MaintenanceType } from '../domain/model/maintenance-type';
import { Money } from '../domain/model/money.value-object';
import { MaintenanceManagementApi } from '../infrastructure/maintenance-management-api';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceManagementStore {
  readonly #api = inject(MaintenanceManagementApi);

  readonly #maintenances = signal<Maintenance[]>([]);
  readonly #loading = signal(false);
  readonly #error = signal<string | null>(null);
  readonly #saving = signal(false);
  readonly #saveError = signal<string | null>(null);

  readonly maintenances = this.#maintenances.asReadonly();
  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly saving = this.#saving.asReadonly();
  readonly saveError = this.#saveError.asReadonly();

  readonly pendingMaintenanceCount = computed(
    () => this.#maintenances().filter((maintenance) => maintenance.isPending()).length,
  );

  constructor() {
    this.loadMaintenances();
  }

  loadMaintenances(): void {
    this.#loading.set(true);
    this.#error.set(null);

    this.#api
      .getMaintenances()
      .pipe(
        retry(2),
        finalize(() => this.#loading.set(false)),
      )
      .subscribe({
        next: (maintenances) => this.#maintenances.set(maintenances),
        error: (error: Error) => {
          this.#maintenances.set([]);
          this.#error.set(error.message);
        },
      });
  }

  maintenanceForMachinery(machineryId: number): Maintenance[] {
    return this.#maintenances().filter((maintenance) => maintenance.machineryId === machineryId);
  }

  /** Same reasoning as `nextProfileId()`/`nextMachineryId()`: json-server
   *  rejects a create whose id already exists, so the next free id is
   *  computed client-side from what is already loaded. */
  private nextMaintenanceId(): number {
    const existingIds = this.#maintenances().map((maintenance) => maintenance.id);
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  }

  scheduleMaintenance(
    props: {
      machineryId: number;
      type: MaintenanceType;
      description: string;
      scheduledDate: Date;
    },
    onSuccess: () => void,
  ): void {
    this.#saving.set(true);
    this.#saveError.set(null);

    const maintenance = new Maintenance({
      id: this.nextMaintenanceId(),
      machineryId: props.machineryId,
      type: props.type,
      status: MaintenanceStatus.Scheduled,
      description: props.description,
      scheduledDate: props.scheduledDate,
      startedAt: null,
      completedAt: null,
      technicianName: null,
      cost: null,
      breakdownReports: [],
    });

    this.#api
      .createMaintenance(maintenance)
      .pipe(finalize(() => this.#saving.set(false)))
      .subscribe({
        next: (created) => {
          this.#maintenances.set([...this.#maintenances(), created]);
          onSuccess();
        },
        error: (error: Error) => this.#saveError.set(error.message),
      });
  }

  startMaintenance(maintenance: Maintenance, technicianName: string): void {
    this.#saveError.set(null);

    const started = new Maintenance({
      id: maintenance.id,
      machineryId: maintenance.machineryId,
      type: maintenance.type,
      status: MaintenanceStatus.InProgress,
      description: maintenance.description,
      scheduledDate: maintenance.scheduledDate,
      startedAt: new Date(),
      completedAt: null,
      technicianName,
      cost: maintenance.cost,
      breakdownReports: maintenance.breakdownReports,
    });

    this.#api.updateMaintenance(started, maintenance.id).subscribe({
      next: (updated) =>
        this.#maintenances.set(
          this.#maintenances().map((item) => (item.id === updated.id ? updated : item)),
        ),
      error: (error: Error) => this.#saveError.set(error.message),
    });
  }

  completeMaintenance(maintenance: Maintenance, cost: Money): void {
    this.#saveError.set(null);

    const completed = new Maintenance({
      id: maintenance.id,
      machineryId: maintenance.machineryId,
      type: maintenance.type,
      status: MaintenanceStatus.Completed,
      description: maintenance.description,
      scheduledDate: maintenance.scheduledDate,
      startedAt: maintenance.startedAt,
      completedAt: new Date(),
      technicianName: maintenance.technicianName,
      cost,
      breakdownReports: maintenance.breakdownReports,
    });

    this.#api.updateMaintenance(completed, maintenance.id).subscribe({
      next: (updated) =>
        this.#maintenances.set(
          this.#maintenances().map((item) => (item.id === updated.id ? updated : item)),
        ),
      error: (error: Error) => this.#saveError.set(error.message),
    });
  }

  /**
   * US-034 (reportar avería en obra): a contractor using a rented machine
   * may not have an open `Maintenance` record yet, so reporting a
   * breakdown creates a new CORRECTIVE one carrying the report, instead
   * of requiring an existing record to attach to first.
   */
  reportBreakdown(
    machineryId: number,
    report: { description: string; severity: BreakdownSeverity },
    onSuccess: () => void,
  ): void {
    this.#saving.set(true);
    this.#saveError.set(null);

    const breakdownReport = new BreakdownReport({
      id: 1,
      description: report.description,
      severity: report.severity,
      reportedAt: new Date(),
      resolvedAt: null,
      resolved: false,
    });

    const maintenance = new Maintenance({
      id: this.nextMaintenanceId(),
      machineryId,
      type: MaintenanceType.Corrective,
      status: MaintenanceStatus.Scheduled,
      description: `Avería reportada: ${report.description}`,
      scheduledDate: new Date(),
      startedAt: null,
      completedAt: null,
      technicianName: null,
      cost: null,
      breakdownReports: [breakdownReport],
    });

    this.#api
      .createMaintenance(maintenance)
      .pipe(finalize(() => this.#saving.set(false)))
      .subscribe({
        next: (created) => {
          this.#maintenances.set([...this.#maintenances(), created]);
          onSuccess();
        },
        error: (error: Error) => this.#saveError.set(error.message),
      });
  }
}
