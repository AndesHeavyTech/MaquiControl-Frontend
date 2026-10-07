import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { IdentityAccessStore } from '../../../application/identity-access-store';

@Component({
  selector: 'app-authentication-section',
  imports: [RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './authentication-section.html',
  styleUrl: './authentication-section.scss',
})
export class AuthenticationSection {
  protected readonly store = inject(IdentityAccessStore);
  readonly #router = inject(Router);

  protected performSignOut(): void {
    this.store.signOut(this.#router);
  }
}
