import { Routes } from '@angular/router';
import { PropertyTableComponent } from './property-table.component/property-table.component';
import { PropertyDetailsComponent } from './property-details.component/property-details.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/Property',
    pathMatch: 'full'
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
