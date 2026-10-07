import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SubscriptionManagementStore } from '../../../application/subscription-management-store';
import { Plan } from '../../../domain/model/plan.entity';

@Component({
  selector: 'app-plans',
  imports: [DatePipe, MatButtonModule, TranslatePipe],
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
})
export class Plans {
  protected readonly store = inject(SubscriptionManagementStore);
  readonly #translate = inject(TranslateService);

  protected isCurrentPlan(plan: Plan): boolean {
    return this.store.currentPlan()?.id === plan.id;
  }

  protected features(plan: Plan): string[] {
    const features = this.#translate.instant(`plans.${plan.code}.features`);
    return Array.isArray(features) ? features : [];
  }

  protected performSubscribe(plan: Plan): void {
    const name = this.#translate.instant(`plans.${plan.code}.name`);
    this.store.subscribe(plan, this.#translate.instant('plans.checkout-title', { name }));
  }
}
