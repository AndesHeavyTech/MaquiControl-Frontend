import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Machinery } from '../domain/model/machinery.entity';
import { MachineryLocation } from '../domain/model/machinery-location.value-object';
import { MachineryStatus } from '../domain/model/machinery-status';
import { MachineryType } from '../domain/model/machinery-type';
import { Currency, Money } from '../domain/model/money.value-object';
import { MachineryResource, MachineryResponse } from './machinery-response';

export class MachineryAssembler implements BaseAssembler<
  Machinery,
  MachineryResource,
  MachineryResponse
> {
  toEntitiesFromResponse(response: MachineryResponse): Machinery[] {
    return response.machinery.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: MachineryResource): Machinery {
    return new Machinery({
      id: resource.id,
      ownerProfileId: resource.ownerProfileId,
      categoryId: resource.categoryId,
      name: resource.name,
      description: resource.description,
      type: this.toMachineryType(resource.type),
      brand: resource.brand,
      model: resource.model,
      manufactureYear: resource.manufactureYear,
      hourlyRate: new Money({
        amount: resource.hourlyRate.amount,
        currency: this.toCurrency(resource.hourlyRate.currency),
      }),
      status: this.toMachineryStatus(resource.status),
      location: new MachineryLocation({
        department: resource.location.department,
        province: resource.location.province,
        district: resource.location.district,
        address: resource.location.address,
      }),
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt),
    });
  }

  toResourceFromEntity(entity: Machinery): MachineryResource {
    return {
      id: entity.id,
      ownerProfileId: entity.ownerProfileId,
      categoryId: entity.categoryId,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      brand: entity.brand,
      model: entity.model,
      manufactureYear: entity.manufactureYear,
      hourlyRate: {
        amount: entity.hourlyRate.amount,
        currency: entity.hourlyRate.currency,
      },
      status: entity.status,
      location: {
        department: entity.location.department,
        province: entity.location.province,
        district: entity.location.district,
        address: entity.location.address,
      },
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private toMachineryType(value: string): MachineryType {
    if (!Object.values(MachineryType).includes(value as MachineryType)) {
      throw new Error(`Unknown machinery type: ${value}`);
    }

    return value as MachineryType;
  }

  private toMachineryStatus(value: string): MachineryStatus {
    if (!Object.values(MachineryStatus).includes(value as MachineryStatus)) {
      throw new Error(`Unknown machinery status: ${value}`);
    }

    return value as MachineryStatus;
  }

  private toCurrency(value: string): Currency {
    if (value !== 'PEN' && value !== 'USD') {
      throw new Error(`Unknown currency: ${value}`);
    }

    return value;
  }
}
