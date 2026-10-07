import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Category } from '../domain/model/category.entity';
import { CategoryResource, CategoryResponse } from './category-response';

export class CategoryAssembler implements BaseAssembler<Category, CategoryResource, CategoryResponse> {
  toEntitiesFromResponse(response: CategoryResponse): Category[] {
    return response.categories.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: CategoryResource): Category {
    return new Category({ id: resource.id, name: resource.name });
  }

  toResourceFromEntity(entity: Category): CategoryResource {
    return { id: entity.id, name: entity.name };
  }
}
