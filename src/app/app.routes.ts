import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';
import { MachineryList } from './fleet-management/presentation/views/machinery-list/machinery-list';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { Plans } from './shared/presentation/views/plans/plans';

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
  },
  {
    path: 'fleet/machinery',
    component: MachineryList,
    title: 'Catálogo de maquinaria | MaquiControl',
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
