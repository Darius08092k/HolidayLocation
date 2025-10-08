import { Routes } from '@angular/router';
import { PropertyTableComponent } from './property-table.component/property-table.component';
import { PropertyDetailsComponent } from './property-details.component/property-details.component';
export const routes: Routes = [
    {
        path: '',
        component: PropertyTableComponent
    },
    {
        path: 'employees',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'details/:id',
        component: PropertyDetailsComponent
    },

];
