import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface MachineryResponse extends BaseResponse {
  machinery: MachineryResource[];
}

export interface MachineryResource extends BaseResource {
  id: number;
  ownerProfileId: number;
  categoryId: number;
  name: string;
  description: string;
  type: string;
  brand: string;
  model: string;
  manufactureYear: number;
  hourlyRate: MoneyResource;
  status: string;
  location: MachineryLocationResource;
  createdAt: string;
  updatedAt: string;
}

export interface MoneyResource {
  amount: number;
  currency: string;
}

export interface MachineryLocationResource {
  department: string;
  province: string;
  district: string;
  address: string;
}
