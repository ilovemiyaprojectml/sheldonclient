import { HttpClientModule } from '@angular/common/http'; 


import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Don't like animations? Replace this with NoopAnimationsModule
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatSnackBar } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from './core/material.module';




import { PushNotificationsModule } from 'ng-push';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

 
// Auth
import { AuthenticationService, ConstantsService, LoggerService } from './_services';


import { RufNgxDatatableModule } from '@ruf/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatRadioModule} from '@angular/material/radio';
import {DataService} from './_services/data.service';
import {DataServiceConfig} from './_services/data_config.service';
import {SseService} from './_services/sse.service';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {BrowseDialogComponent} from './dialogs/browse/browse.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';

import {BrowseConfigDialogComponent} from './dialogs/browse/browse_config.dialog.component';
import {EditConfigDialogComponent} from './dialogs/edit/edit_config.dialog.component';
import {AddConfigDialogComponent} from './dialogs/add/add_config.dialog.component';
import {DeleteConfigDialogComponent} from './dialogs/delete/delete_config.dialog.component';



import {
  RufAppCanvasModule,
  RufLayoutModule,
  RufBannerModule,
  RufFooterModule,
  RufIconModule,
  RufMenubarModule,
  RufNavbarModule,
  RufPageHeaderModule,
  RufUniqueIdModule,
  RufCardModule
} from '@ruf/shell';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RufDynamicMenubarModule} from '@ruf/shell';

import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppRoutingModule } from './app-routing.module';
import { EmpDashboardComponent } from './emp-dashboard/emp-dashboard.component';
import { AdminAddUserComponent } from './admin/admin-adduser.component';
import { AdminConfigComponent } from './admin/admin-config.component';
import { AdminReportComponent } from './admin/admin-report.component';
import { ShiftScheduleCreateComponent } from './shift-schedule-create/shift-schedule-create.component';
import { RootDashboardComponent, EmployeeViewDialog } from './root-dashboard/root-dashboard.component';

@NgModule({ 
  declarations: [
    AppComponent,
    UserLoginComponent,
    EmpDashboardComponent,
    AdminAddUserComponent,
    AdminConfigComponent,
    AdminReportComponent,
    ShiftScheduleCreateComponent,
    RootDashboardComponent,
	AddDialogComponent,
	AddConfigDialogComponent,
	BrowseDialogComponent,
	BrowseConfigDialogComponent,
    EditDialogComponent,
    EditConfigDialogComponent,
    DeleteDialogComponent,
    DeleteConfigDialogComponent,
  EmployeeViewDialog],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    MatIconModule,
    MatTabsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RufAppCanvasModule,
    RufLayoutModule,
    RufBannerModule,
    RufFooterModule,
    RufIconModule,
    RufMenubarModule,
    RufNavbarModule,
    RufPageHeaderModule,
    CommonModule,
    RufCardModule,
    RufUniqueIdModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    PushNotificationsModule,
    RufNgxDatatableModule,
    NgbModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    RufDynamicMenubarModule,
	MatRadioModule,
	MatDialogModule,
	MatInputModule,
	MatPaginatorModule,
	MatSortModule,
    MatTableModule,
    MatToolbarModule
  ],exports: [
    RootDashboardComponent
  ],
   entryComponents: [
    AddDialogComponent,
    AddConfigDialogComponent,
    BrowseDialogComponent,
    BrowseConfigDialogComponent,
    EditDialogComponent,
    EditConfigDialogComponent,
    DeleteDialogComponent,
    DeleteConfigDialogComponent,
    EmployeeViewDialog

  ],
  providers: [AuthenticationService, ConstantsService, CookieService, DatePipe, LoggerService, MatSnackBar, DataService, DataServiceConfig, SseService],
  bootstrap: [AppComponent]
})
export class AppModule {}

