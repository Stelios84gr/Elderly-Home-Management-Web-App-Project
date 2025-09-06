import { Routes } from '@angular/router';
import { StaffPage } from './components/staff-page/staff-page';
import { PatientsPage } from './components/patients-page/patients-page';
import { VisitorsPage } from './components/visitors-page/visitors-page';
import { StaffLogin } from './components/login/login';

export const routes: Routes = [
    {path: 'staff-page', component: StaffPage},
    {path: 'patients-page', component: PatientsPage},
    {path: 'visitors-page', component: VisitorsPage},
    {path: 'login', component: StaffLogin}
];