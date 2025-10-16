import { Routes } from '@angular/router';
import { PropertyTableComponent } from './property-table.component/property-table.component';
import { PropertyDetailsComponent } from './property-details.component/property-details.component';
import { AuthComponenet } from './auth.componenet/auth.componenet';
import { RegisterComponenet } from './register.componenet/register.componenet';
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthComponenet
  },
  {
    path: 'register',
    component: RegisterComponenet
  },
  {
    path: 'Property',
    component: PropertyTableComponent
  },
  {
    path: 'property/:id',
    component: PropertyDetailsComponent
  }
];
