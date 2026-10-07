import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface RentalResponse extends BaseResponse {
  rentals: RentalResource[];
}

export interface RentalResource extends BaseResource {
  id: number;
  machineryId: number;
  contractorProfileId: number;
  period: RentalPeriodResource;
  status: string;
  totalAmount: MoneyResource;
  cancellationReason: string | null;
  requestedAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
}

export interface RentalPeriodResource {
  startDate: string;
  endDate: string;
}

export interface MoneyResource {
  amount: number;
  currency: string;
}
