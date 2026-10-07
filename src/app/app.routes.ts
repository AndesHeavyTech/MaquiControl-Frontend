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
import { TermsOfService } from './shared/presentation/views/terms-of-service/terms-of-service';
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
    title: 'titles.home',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'fleet/machinery',
    component: MachineryList,
    title: 'titles.machinery-catalog',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'fleet/machinery/new',
    component: MachineryForm,
    title: 'titles.publish-machinery',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'fleet/machinery/:id/edit',
    component: MachineryForm,
    title: 'titles.edit-machinery',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'profile',
    component: ProfilePage,
    title: 'titles.profile',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'rental/request/:machineryId',
    component: RentalRequestPage,
    title: 'titles.rental-request',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'rental/reservations',
    component: ReservationList,
    title: 'titles.reservations',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'maintenance',
    component: MaintenanceSchedulePage,
    title: 'titles.maintenance',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'maintenance/report/:machineryId',
    component: BreakdownReportForm,
    title: 'titles.breakdown-report',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'operations/:rentalId',
    component: ServiceOperationPage,
    title: 'titles.service-operation',
    canActivate: [identityAccessGuard],
  },
  {
    path: 'terms',
    component: TermsOfService,
    title: 'titles.terms',
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
    title: 'titles.page-not-found',
  },
];
