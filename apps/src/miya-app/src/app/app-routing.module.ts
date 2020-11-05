import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLoginComponent } from './user-login/user-login.component';
import { EmpDashboardComponent } from './emp-dashboard/emp-dashboard.component';
import { AdminAddUserComponent } from './admin/admin-adduser.component';
import { AdminConfigComponent } from './admin/admin-config.component';
import { AdminReportComponent } from './admin/admin-report.component';
import { ShiftScheduleCreateComponent } from './shift-schedule-create/shift-schedule-create.component';
import {RootDashboardComponent } from './root-dashboard/root-dashboard.component';

const routes: Routes = [
    {   path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    { path: 'login', component: UserLoginComponent },
    { path: 'user-dashboard', component: EmpDashboardComponent},
    { path: 'admin-usermgt', component: AdminAddUserComponent},
    { path: 'admin-config', component: AdminConfigComponent},
    { path: 'admin-report', component: AdminReportComponent},
    { path: 'newshift', component: ShiftScheduleCreateComponent},
    { path: 'root-dashboard', component: RootDashboardComponent}
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{ } 

