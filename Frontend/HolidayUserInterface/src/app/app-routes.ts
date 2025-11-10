import { Routes } from '@angular/router';
import { PropertyTableComponent } from './property-table.component/property-table.component';
import { PropertyDetailsComponent } from './property-details.component/property-details.component';
import { AuthComponenet } from './auth.componenet/auth.componenet';
import { RegisterComponenet } from './register.componenet/register.componenet';
import { AdminAccountManagemnetComponent } from './admin-account-managemnet.component/admin-account-managemnet.component';
import { authGuard, adminGuard, homeGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [homeGuard],
    children: []
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
    component: PropertyTableComponent,
    canActivate: [authGuard]
  },
  {
    path: 'property/:id',
    component: PropertyDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/accounts',
    component: AdminAccountManagemnetComponent,
    canActivate: [adminGuard]
  }
];
