import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface CategoryResponse extends BaseResponse {
  categories: CategoryResource[];
}

export interface CategoryResource extends BaseResource {
  id: number;
  name: string;
}
