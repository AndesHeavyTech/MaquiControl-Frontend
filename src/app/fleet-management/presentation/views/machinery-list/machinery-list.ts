import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IdentityAccessStore } from '../../../../identity-access-management/application/identity-access-store';
import { RoleName } from '../../../../identity-access-management/domain/model/role-name';
import { ProfilesManagementStore } from '../../../../profiles-management/application/profiles-management-store';
import { FleetManagementStore } from '../../../application/fleet-management-store';
import { Machinery } from '../../../domain/model/machinery.entity';
import { MachineryStatus } from '../../../domain/model/machinery-status';

@Component({
  selector: 'app-machinery-list',
  imports: [DecimalPipe, RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './machinery-list.html',
  styleUrl: './machinery-list.scss',
})
export class MachineryList {
  protected readonly store = inject(FleetManagementStore);
  readonly #profilesManagementStore = inject(ProfilesManagementStore);
  readonly #identityAccessStore = inject(IdentityAccessStore);
  readonly #translate = inject(TranslateService);

  /** Only fleet owners publish machinery and only contractors rent it. */
  protected readonly canPublish = computed(() => this.#identityAccessStore.hasRole(RoleName.FleetOwner));
  protected readonly canRent = computed(() => this.#identityAccessStore.hasRole(RoleName.Contractor));

  /** Renting your own published machinery makes no sense: compare
   *  `Machinery.ownerProfileId` against the signed-in user's own
   *  `Profile.id`, same relationship `ReservationList` uses. */
  protected isOwner(machinery: Machinery): boolean {
    const profile = this.#profilesManagementStore.currentProfile();
    return !!profile && machinery.ownerProfileId === profile.id;
  }

  /** The category replaces the old fixed machinery type enum. */
  protected categoryName(machinery: Machinery): string {
    return this.store.categoryById(machinery.categoryId)?.name ?? '';
  }

  protected machineryStatusLabel(status: MachineryStatus): string {
    return `enums.machinery-status.${status}`;
  }

  protected machineryStatusClass(status: MachineryStatus): string {
    return status.toLowerCase().replaceAll('_', '-');
  }

  protected performDelete(id: number, name: string): void {
    if (confirm(this.#translate.instant('machinery-list.confirm-delete', { name }))) {
      this.store.deleteMachinery(id);
    }
  }
}
