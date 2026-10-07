import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Category } from '../domain/model/category.entity';
import { Machinery } from '../domain/model/machinery.entity';
import { CategoryApiEndpoint } from './category-api-endpoint';
import { MachineryApiEndpoint } from './machinery-api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class FleetManagementApi extends BaseApi {
  readonly #machineryEndpoint = new MachineryApiEndpoint(this.http);
  readonly #categoryEndpoint = new CategoryApiEndpoint(this.http);

  getMachinery(): Observable<Machinery[]> {
    return this.#machineryEndpoint.getAll();
  }

  getMachineryById(id: number): Observable<Machinery> {
    return this.#machineryEndpoint.getById(id);
  }

  createMachinery(machinery: Machinery): Observable<Machinery> {
    return this.#machineryEndpoint.create(machinery);
  }

  updateMachinery(machinery: Machinery, id: number): Observable<Machinery> {
    return this.#machineryEndpoint.update(machinery, id);
  }

  deleteMachinery(id: number): Observable<void> {
    return this.#machineryEndpoint.delete(id);
  }

  getCategories(): Observable<Category[]> {
    return this.#categoryEndpoint.getAll();
  }

  createCategory(category: Category): Observable<Category> {
    return this.#categoryEndpoint.create(category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.#categoryEndpoint.update(category, category.id);
  }

  deleteCategory(id: number): Observable<void> {
    return this.#categoryEndpoint.delete(id);
  }
}
