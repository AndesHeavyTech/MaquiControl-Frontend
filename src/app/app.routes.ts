import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';
import { MachineryList } from './fleet-management/presentation/views/machinery-list/machinery-list';
import { MachineryForm } from './fleet-management/presentation/views/machinery-form/machinery-form';
import { ProfilePage } from './profiles-management/presentation/views/profile-page/profile-page';
import { RentalRequestPage } from './rental-management/presentation/views/rental-request-page/rental-request-page';
import { ReservationList } from './rental-management/presentation/views/reservation-list/reservation-list';
import { MaintenanceSchedulePage } from './maintenance-management/presentation/views/maintenance-schedule-page/maintenance-schedule-page';
import { BreakdownReportForm } from './maintenance-management/presentation/views/breakdown-report-form/breakdown-report-form';
import { ServiceOperationPage } from './operations-management/presentation/views/service-operation-page/service-operation-page';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { identityAccessGuard } from './identity-access-management/infrastructure/identity-access.guard';

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
    path: 'maintenance',
    component: MaintenanceSchedulePage,
    title: 'Mantenimiento | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'maintenance/report/:machineryId',
    component: BreakdownReportForm,
    title: 'Reportar avería | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'operations/:rentalId',
    component: ServiceOperationPage,
    title: 'Operación de servicio | MaquiControl',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'identity',
    loadChildren: identityAccessManagementRoutes,
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'Página no encontrada | MaquiControl',
  },
];
