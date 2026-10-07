import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Currency, Money } from '../domain/model/money.value-object';
import { Rental } from '../domain/model/rental.entity';
import { RentalPeriod } from '../domain/model/rental-period.value-object';
import { RentalStatus } from '../domain/model/rental-status';
import { RentalResource, RentalResponse } from './rental-response';

export class RentalAssembler implements BaseAssembler<Rental, RentalResource, RentalResponse> {
  toEntitiesFromResponse(response: RentalResponse): Rental[] {
    return response.rentals.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: RentalResource): Rental {
    return new Rental({
      id: resource.id,
      machineryId: resource.machineryId,
      contractorProfileId: resource.contractorProfileId,
      period: RentalPeriod.fromIsoDates(resource.period.startDate, resource.period.endDate),
      status: this.toRentalStatus(resource.status),
      totalAmount: new Money({
        amount: resource.totalAmount.amount,
        currency: this.toCurrency(resource.totalAmount.currency),
      }),
      cancellationReason: resource.cancellationReason,
      requestedAt: new Date(resource.requestedAt),
      confirmedAt: resource.confirmedAt ? new Date(resource.confirmedAt) : null,
      cancelledAt: resource.cancelledAt ? new Date(resource.cancelledAt) : null,
    });
  }

  toResourceFromEntity(entity: Rental): RentalResource {
    return {
      id: entity.id,
      machineryId: entity.machineryId,
      contractorProfileId: entity.contractorProfileId,
      period: {
        startDate: RentalPeriod.toIsoDate(entity.period.startDate),
        endDate: RentalPeriod.toIsoDate(entity.period.endDate),
      },
      status: entity.status,
      totalAmount: {
        amount: entity.totalAmount.amount,
        currency: entity.totalAmount.currency,
      },
      cancellationReason: entity.cancellationReason,
      requestedAt: entity.requestedAt.toISOString(),
      confirmedAt: entity.confirmedAt ? entity.confirmedAt.toISOString() : null,
      cancelledAt: entity.cancelledAt ? entity.cancelledAt.toISOString() : null,
    };
  }

  private toRentalStatus(value: string): RentalStatus {
    if (!Object.values(RentalStatus).includes(value as RentalStatus)) {
      throw new Error(`Unknown rental status: ${value}`);
    }

    return value as RentalStatus;
  }

  private toCurrency(value: string): Currency {
    if (value !== 'PEN' && value !== 'USD') {
      throw new Error(`Unknown currency: ${value}`);
    }

    return value;
  }
}
