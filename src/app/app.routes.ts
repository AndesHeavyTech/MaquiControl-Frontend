import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';
import { MachineryList } from './fleet-management/presentation/views/machinery-list/machinery-list';
import { MachineryForm } from './fleet-management/presentation/views/machinery-form/machinery-form';
import { ProfilePage } from './profiles-management/presentation/views/profile-page/profile-page';
import { RentalRequestPage } from './rental-management/presentation/views/rental-request-page/rental-request-page';
import { ReservationList } from './rental-management/presentation/views/reservation-list/reservation-list';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { identityAccessGuard } from './identity-access-management/infrastructure/identity-access.guard';
import { Plans } from './shared/presentation/views/plans/plans';

const identityAccessManagementRoutes = () =>
  import('./identity-access-management/presentation/identity-access-management.routes').then(
    (m) => m.identityAccessManagementRoutes,
  );

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: Home,
    title: 'Inicio | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'fleet/machinery',
    component: MachineryList,
    title: 'Catálogo de maquinaria | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'fleet/machinery/new',
    component: MachineryForm,
    title: 'Publicar maquinaria | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'fleet/machinery/:id/edit',
    component: MachineryForm,
    title: 'Editar maquinaria | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'profile',
    component: ProfilePage,
    title: 'Mi perfil | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'rental/request/:machineryId',
    component: RentalRequestPage,
    title: 'Solicitar alquiler | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'rental/reservations',
    component: ReservationList,
    title: 'Reservas | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'identity',
    loadChildren: identityAccessManagementRoutes,
  },
  {
    path: 'plans',
    component: Plans,
    title: 'Planes | MaquiControl',
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'Página no encontrada | MaquiControl',
  },
];
