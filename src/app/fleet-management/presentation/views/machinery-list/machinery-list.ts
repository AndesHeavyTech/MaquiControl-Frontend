import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FleetManagementStore } from '../../../application/fleet-management-store';
import { MachineryStatus } from '../../../domain/model/machinery-status';
import { MachineryType } from '../../../domain/model/machinery-type';

@Component({
  selector: 'app-machinery-list',
  imports: [DecimalPipe, RouterLink, MatButtonModule],
  templateUrl: './machinery-list.html',
  styleUrl: './machinery-list.scss',
})
export class MachineryList {
  protected readonly store = inject(FleetManagementStore);

  protected machineryTypeLabel(type: MachineryType): string {
    const labels: Record<MachineryType, string> = {
      [MachineryType.Excavator]: 'Excavadora',
      [MachineryType.BackhoeLoader]: 'Retroexcavadora',
      [MachineryType.Loader]: 'Cargador',
      [MachineryType.Crane]: 'Grúa',
      [MachineryType.Bulldozer]: 'Bulldozer',
      [MachineryType.Other]: 'Otro',
    };

    return labels[type];
  }

  protected machineryStatusLabel(status: MachineryStatus): string {
    const labels: Record<MachineryStatus, string> = {
      [MachineryStatus.Available]: 'Disponible',
      [MachineryStatus.Reserved]: 'Reservada',
      [MachineryStatus.Rented]: 'Alquilada',
      [MachineryStatus.InMaintenance]: 'En mantenimiento',
      [MachineryStatus.OutOfService]: 'Fuera de servicio',
    };

    return labels[status];
  }

  protected machineryStatusClass(status: MachineryStatus): string {
    return status.toLowerCase().replaceAll('_', '-');
  }

  protected performDelete(id: number, name: string): void {
    if (confirm(`¿Eliminar "${name}" del catálogo? Esta acción no se puede deshacer.`)) {
      this.store.deleteMachinery(id);
    }
  }
}
