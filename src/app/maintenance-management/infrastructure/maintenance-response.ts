import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface MaintenanceResponse extends BaseResponse {
  maintenances: MaintenanceResource[];
}

export interface MaintenanceResource extends BaseResource {
  id: number;
  machineryId: number;
  type: string;
  status: string;
  description: string;
  scheduledDate: string;
  startedAt: string | null;
  completedAt: string | null;
  technicianName: string | null;
  cost: MoneyResource | null;
  breakdownReports: BreakdownReportResource[];
}

export interface BreakdownReportResource {
  id: number;
  description: string;
  severity: string;
  reportedAt: string;
  resolvedAt: string | null;
  resolved: boolean;
}

export interface MoneyResource {
  amount: number;
  currency: string;
}
