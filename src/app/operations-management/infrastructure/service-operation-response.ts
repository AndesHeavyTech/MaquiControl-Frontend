import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ServiceOperationResponse extends BaseResponse {
  serviceOperations: ServiceOperationResource[];
}

export interface ServiceOperationResource extends BaseResource {
  id: number;
  rentalId: number;
  machineryId: number;
  operatorProfileId: number | null;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  workedHours: WorkedHoursResource[];
}

export interface WorkedHoursResource {
  id: number;
  workDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  status: string;
  observations: string | null;
}
