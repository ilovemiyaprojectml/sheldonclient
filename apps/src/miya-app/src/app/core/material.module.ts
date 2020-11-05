
/*

  material.module.ts

  All Material Module (from angular) are imported here. If you want to add another Material Module,
  just add it on import {...} on line 16 then add that module on @NgModule imports and exports array

*/




import {NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, 
  MatFormFieldModule, MatListModule, MatBadgeModule, MatRippleModule, MatSnackBarModule
} from '@angular/material';

import { MatMomentDateModule}  from '@angular/material-moment-adapter';




@NgModule({
  imports: [
  CommonModule, 
  MatToolbarModule,
  MatButtonModule, 
  MatCardModule,
  MatInputModule,
  MatDialogModule,
  MatTableModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatListModule,
  MatBadgeModule,
  MatMomentDateModule,
  MatRippleModule,
  MatSnackBarModule
  ],
  exports: [
  CommonModule,
   MatToolbarModule, 
   MatButtonModule, 
   MatCardModule, 
   MatInputModule, 
   MatDialogModule, 
   MatTableModule, 
   MatMenuModule,
   MatIconModule,
   MatProgressSpinnerModule,
   MatCheckboxModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatFormFieldModule,
   MatListModule,
   MatBadgeModule,
   MatRippleModule,
   MatSnackBarModule
   ],
})
export class CustomMaterialModule { }