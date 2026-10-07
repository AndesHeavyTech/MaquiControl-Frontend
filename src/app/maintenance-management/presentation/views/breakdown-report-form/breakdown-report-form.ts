import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { FleetManagementStore } from '../../../../fleet-management/application/fleet-management-store';
import { MaintenanceManagementStore } from '../../../application/maintenance-management-store';
import { BreakdownSeverity } from '../../../domain/model/breakdown-severity';

@Component({
  selector: 'app-breakdown-report-form',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './breakdown-report-form.html',
  styleUrl: './breakdown-report-form.scss',
})
export class BreakdownReportForm implements OnInit {
  protected readonly store = inject(MaintenanceManagementStore);
  protected readonly fleetManagementStore = inject(FleetManagementStore);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  protected machineryId = 0;
  protected readonly severities = Object.values(BreakdownSeverity);

  protected readonly form = new FormGroup({
    severity: new FormControl<BreakdownSeverity>(BreakdownSeverity.Medium, { nonNullable: true }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.machineryId = Number(this.#route.snapshot.paramMap.get('machineryId'));

    if (!this.fleetManagementStore.machineryById(this.machineryId)) {
      this.#router.navigate(['/fleet/machinery']).then();
    }
  }

  protected get machinery() {
    return this.fleetManagementStore.machineryById(this.machineryId);
  }

  protected performReport(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.store.reportBreakdown(
      this.machineryId,
      { description: value.description, severity: value.severity },
      () => this.#router.navigate(['/fleet/machinery']).then(),
    );
  }
}
