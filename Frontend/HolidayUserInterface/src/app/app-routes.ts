import { Routes } from '@angular/router';
import { PropertyTableComponent } from './property-table.component/property-table.component';
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

];
