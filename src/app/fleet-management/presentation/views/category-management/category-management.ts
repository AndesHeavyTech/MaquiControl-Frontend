import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FleetManagementStore } from '../../../application/fleet-management-store';
import { Category } from '../../../domain/model/category.entity';

const NAME_MAX_LENGTH = 40;

@Component({
  selector: 'app-category-management',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './category-management.html',
  styleUrl: './category-management.scss',
})
export class CategoryManagement {
  protected readonly store = inject(FleetManagementStore);
  readonly #translate = inject(TranslateService);

  protected readonly editingId = signal<number | null>(null);

  protected readonly newName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(NAME_MAX_LENGTH), this.#uniqueName(() => null)],
  });

  protected readonly editedName = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.maxLength(NAME_MAX_LENGTH),
      this.#uniqueName(() => this.editingId()),
    ],
  });

  protected readonly createForm = new FormGroup({ name: this.newName });
  protected readonly editForm = new FormGroup({ name: this.editedName });

  #uniqueName(exceptId: () => number | null) {
    return (control: AbstractControl<string>): ValidationErrors | null =>
      control.value.trim() && this.store.isCategoryNameTaken(control.value, exceptId()) ? { duplicated: true } : null;
  }

  protected performCreate(): void {
    if (this.newName.invalid || this.newName.value.trim().length === 0) {
      this.newName.markAsTouched();
      return;
    }

    this.store.createCategory(this.newName.value.trim(), () => this.newName.reset());
  }

  protected startEditing(category: Category): void {
    this.editingId.set(category.id);
    this.editedName.setValue(category.name);
  }

  protected cancelEditing(): void {
    this.editingId.set(null);
  }

  protected performRename(category: Category): void {
    this.editedName.updateValueAndValidity();
    if (this.editedName.invalid || this.editedName.value.trim().length === 0) {
      this.editedName.markAsTouched();
      return;
    }

    this.store.renameCategory(category, this.editedName.value.trim(), () => this.editingId.set(null));
  }

  protected performDelete(category: Category): void {
    if (confirm(this.#translate.instant('categories.confirm-delete', { name: category.name }))) {
      this.store.deleteCategory(category.id);
    }
  }
}
