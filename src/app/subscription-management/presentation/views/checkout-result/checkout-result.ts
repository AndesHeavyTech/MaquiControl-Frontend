import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { SubscriptionManagementStore } from '../../../application/subscription-management-store';

@Component({
  selector: 'app-checkout-result',
  imports: [RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './checkout-result.html',
  styleUrl: './checkout-result.scss',
})
export class CheckoutResult implements OnInit {
  protected readonly store = inject(SubscriptionManagementStore);
  readonly #route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.store.confirmCheckout(this.#route.snapshot.queryParamMap.get('payment_id'));
  }
}
