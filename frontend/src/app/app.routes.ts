import { Routes } from '@angular/router';
import { StaffTable } from './components/staff-table/staff-table';
import { StaffPage } from './components/staff-page/staff-page';

export const routes: Routes = [
    {path: 'staff-page', component: StaffPage},
];