import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { OperationStatus } from '../domain/model/operation-status';
import { ServiceOperation } from '../domain/model/service-operation.entity';
import { WorkedHours } from '../domain/model/worked-hours.entity';
import { WorkedHoursStatus } from '../domain/model/worked-hours-status';
import {
  ServiceOperationResource,
  ServiceOperationResponse,
  WorkedHoursResource,
} from './service-operation-response';

export class ServiceOperationAssembler
  implements BaseAssembler<ServiceOperation, ServiceOperationResource, ServiceOperationResponse>
{
  toEntitiesFromResponse(response: ServiceOperationResponse): ServiceOperation[] {
    return response.serviceOperations.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: ServiceOperationResource): ServiceOperation {
    return new ServiceOperation({
      id: resource.id,
      rentalId: resource.rentalId,
      machineryId: resource.machineryId,
      operatorProfileId: resource.operatorProfileId,
      status: this.toOperationStatus(resource.status),
      startedAt: resource.startedAt ? new Date(resource.startedAt) : null,
      completedAt: resource.completedAt ? new Date(resource.completedAt) : null,
      workedHours: resource.workedHours.map((record) => this.toWorkedHours(record)),
    });
  }

  toResourceFromEntity(entity: ServiceOperation): ServiceOperationResource {
    return {
      id: entity.id,
      rentalId: entity.rentalId,
      machineryId: entity.machineryId,
      operatorProfileId: entity.operatorProfileId,
      status: entity.status,
      startedAt: entity.startedAt ? entity.startedAt.toISOString() : null,
      completedAt: entity.completedAt ? entity.completedAt.toISOString() : null,
      workedHours: entity.workedHours.map((record) => ({
        id: record.id,
        workDate: record.workDate.toISOString().slice(0, 10),
        startTime: record.startTime,
        endTime: record.endTime,
        totalHours: record.totalHours,
        status: record.status,
        observations: record.observations,
      })),
    };
  }

  private toWorkedHours(resource: WorkedHoursResource): WorkedHours {
    return new WorkedHours({
      id: resource.id,
      workDate: new Date(resource.workDate),
      startTime: resource.startTime,
      endTime: resource.endTime,
      totalHours: resource.totalHours,
      status: this.toWorkedHoursStatus(resource.status),
      observations: resource.observations,
    });
  }

  private toOperationStatus(value: string): OperationStatus {
    if (!Object.values(OperationStatus).includes(value as OperationStatus)) {
      throw new Error(`Unknown operation status: ${value}`);
    }

    return value as OperationStatus;
  }

  private toWorkedHoursStatus(value: string): WorkedHoursStatus {
    if (!Object.values(WorkedHoursStatus).includes(value as WorkedHoursStatus)) {
      throw new Error(`Unknown worked hours status: ${value}`);
    }

    return value as WorkedHoursStatus;
  }
}
