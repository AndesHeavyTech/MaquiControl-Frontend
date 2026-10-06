import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Category } from '../domain/model/category.entity';
import { CategoryAssembler } from './category-assembler';
import { CategoryResource, CategoryResponse } from './category-response';

export class CategoryApiEndpoint extends BaseApiEndpoint<
  Category,
  CategoryResource,
  CategoryResponse,
  CategoryAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/categories`, new CategoryAssembler());
  }
}
