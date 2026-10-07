import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProfilesManagementStore } from '../../../../profiles-management/application/profiles-management-store';
import { FleetManagementStore } from '../../../application/fleet-management-store';
import { Machinery } from '../../../domain/model/machinery.entity';
import { MachineryStatus } from '../../../domain/model/machinery-status';
import { MachineryType } from '../../../domain/model/machinery-type';

@Component({
  selector: 'app-machinery-list',
  imports: [DecimalPipe, RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './machinery-list.html',
  styleUrl: './machinery-list.scss',
})
export class MachineryList {
  protected readonly store = inject(FleetManagementStore);
  readonly #profilesManagementStore = inject(ProfilesManagementStore);
  readonly #translate = inject(TranslateService);

  /** Renting your own published machinery makes no sense: compare
   *  `Machinery.ownerProfileId` against the signed-in user's own
   *  `Profile.id`, same relationship `ReservationList` uses. */
  protected isOwner(machinery: Machinery): boolean {
    const profile = this.#profilesManagementStore.currentProfile();
    return !!profile && machinery.ownerProfileId === profile.id;
  }

  protected machineryTypeLabel(type: MachineryType): string {
    return `enums.machinery-type.${type}`;
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
