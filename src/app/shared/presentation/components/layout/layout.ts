import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterContent } from '../footer-content/footer-content';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { AuthenticationSection } from '../../../../identity-access-management/presentation/components/authentication-section/authentication-section';

interface NavigationOption {
  link: string;
  label: string;
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
  protected readonly options = signal<NavigationOption[]>([
    { link: '/home', label: 'option.home' },
    { link: '/fleet/machinery', label: 'option.machinery' },
    { link: '/profile', label: 'option.profile' },
    { link: '/rental/reservations', label: 'option.reservations' },
    { link: '/maintenance', label: 'option.maintenance' },
  ]);
}
