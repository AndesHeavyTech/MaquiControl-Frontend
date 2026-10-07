import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterContent } from '../footer-content/footer-content';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { AuthenticationSection } from '../../../../identity-access-management/presentation/components/authentication-section/authentication-section';
import { IdentityAccessStore } from '../../../../identity-access-management/application/identity-access-store';
import { RoleName } from '../../../../identity-access-management/domain/model/role-name';

interface NavigationOption {
  link: string;
  label: string;
  /** Only these roles see the option; every signed-in user when omitted. */
  roles?: RoleName[];
}

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatToolbarModule,
    TranslatePipe,
    FooterContent,
    LanguageSwitcher,
    AuthenticationSection,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  readonly #identityAccessStore = inject(IdentityAccessStore);

  readonly #allOptions: NavigationOption[] = [
    { link: '/home', label: 'option.home' },
    { link: '/fleet/machinery', label: 'option.machinery' },
    { link: '/profile', label: 'option.profile' },
    { link: '/rental/reservations', label: 'option.reservations' },
    { link: '/maintenance', label: 'option.maintenance', roles: [RoleName.FleetOwner] },
  ];

  protected readonly options = computed(() =>
    this.#allOptions.filter(
      (option) => !option.roles || this.#identityAccessStore.hasAnyRole(option.roles),
    ),
  );
}
