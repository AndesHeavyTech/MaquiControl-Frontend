import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterContent } from '../footer-content/footer-content';
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
    FooterContent,
    AuthenticationSection,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  protected readonly options = signal<NavigationOption[]>([
    { link: '/home', label: 'Inicio' },
    { link: '/fleet/machinery', label: 'Maquinaria' },
    { link: '/profile', label: 'Mi perfil' },
    { link: '/rental/reservations', label: 'Reservas' },
    { link: '/maintenance', label: 'Mantenimiento' },
  ]);
}
