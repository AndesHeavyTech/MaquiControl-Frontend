import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BreakdownReport } from '../domain/model/breakdown-report.entity';
import { BreakdownSeverity } from '../domain/model/breakdown-severity';
import { Maintenance } from '../domain/model/maintenance.entity';
import { MaintenanceStatus } from '../domain/model/maintenance-status';
import { MaintenanceType } from '../domain/model/maintenance-type';
import { Currency, Money } from '../domain/model/money.value-object';
import {
  BreakdownReportResource,
  MaintenanceResource,
  MaintenanceResponse,
} from './maintenance-response';

export class MaintenanceAssembler
  implements BaseAssembler<Maintenance, MaintenanceResource, MaintenanceResponse>
{
  toEntitiesFromResponse(response: MaintenanceResponse): Maintenance[] {
    return response.maintenances.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: MaintenanceResource): Maintenance {
    return new Maintenance({
      id: resource.id,
      machineryId: resource.machineryId,
      type: this.toMaintenanceType(resource.type),
      status: this.toMaintenanceStatus(resource.status),
      description: resource.description,
      scheduledDate: new Date(resource.scheduledDate),
      startedAt: resource.startedAt ? new Date(resource.startedAt) : null,
      completedAt: resource.completedAt ? new Date(resource.completedAt) : null,
      technicianName: resource.technicianName,
      cost: resource.cost
        ? new Money({ amount: resource.cost.amount, currency: this.toCurrency(resource.cost.currency) })
        : null,
      breakdownReports: resource.breakdownReports.map((report) => this.toBreakdownReport(report)),
    });
  }

  toResourceFromEntity(entity: Maintenance): MaintenanceResource {
    return {
      id: entity.id,
      machineryId: entity.machineryId,
      type: entity.type,
      status: entity.status,
      description: entity.description,
      scheduledDate: entity.scheduledDate.toISOString().slice(0, 10),
      startedAt: entity.startedAt ? entity.startedAt.toISOString() : null,
      completedAt: entity.completedAt ? entity.completedAt.toISOString() : null,
      technicianName: entity.technicianName,
      cost: entity.cost ? { amount: entity.cost.amount, currency: entity.cost.currency } : null,
      breakdownReports: entity.breakdownReports.map((report) => ({
        id: report.id,
        description: report.description,
        severity: report.severity,
        reportedAt: report.reportedAt.toISOString(),
        resolvedAt: report.resolvedAt ? report.resolvedAt.toISOString() : null,
        resolved: report.resolved,
      })),
    };
  }

  private toBreakdownReport(resource: BreakdownReportResource): BreakdownReport {
    return new BreakdownReport({
      id: resource.id,
      description: resource.description,
      severity: this.toBreakdownSeverity(resource.severity),
      reportedAt: new Date(resource.reportedAt),
      resolvedAt: resource.resolvedAt ? new Date(resource.resolvedAt) : null,
      resolved: resource.resolved,
    });
  }

  private toMaintenanceType(value: string): MaintenanceType {
    if (!Object.values(MaintenanceType).includes(value as MaintenanceType)) {
      throw new Error(`Unknown maintenance type: ${value}`);
    }

    return value as MaintenanceType;
  }

  private toMaintenanceStatus(value: string): MaintenanceStatus {
    if (!Object.values(MaintenanceStatus).includes(value as MaintenanceStatus)) {
      throw new Error(`Unknown maintenance status: ${value}`);
    }

    return value as MaintenanceStatus;
  }

  private toBreakdownSeverity(value: string): BreakdownSeverity {
    if (!Object.values(BreakdownSeverity).includes(value as BreakdownSeverity)) {
      throw new Error(`Unknown breakdown severity: ${value}`);
    }

    return value as BreakdownSeverity;
  }

  private toCurrency(value: string): Currency {
    if (value !== 'PEN' && value !== 'USD') {
      throw new Error(`Unknown currency: ${value}`);
    }

    return value;
  }
}
