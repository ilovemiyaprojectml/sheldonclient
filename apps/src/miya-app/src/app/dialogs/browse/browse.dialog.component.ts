import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {DataService} from '../../_services/data.service';
import {FormControl} from '@angular/forms';
import {UserA} from '../../_models/usera';

import { NativeDateAdapter, DateAdapter,
 MAT_DATE_FORMATS } from '@angular/material';
import { formatDate } from '@angular/common';

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);;
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-browse.dialog',
  templateUrl: '../../dialogs/browse/browse.dialog.html',
  styleUrls: ['../../dialogs/browse/browse.dialog.css'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}
]
})
export class BrowseDialogComponent {
	
	public managers: UserA[];
	
  constructor(public dialogRef: MatDialogRef<BrowseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService) { }
			  
	ngOnInit()  
    {  
		this.managers = this.data.managers;
    }  
			  

  formControl = new FormControl('', [
  
  ]);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
