import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {DataServiceConfig} from '../../_services/data_config.service';
import {FormControl} from '@angular/forms';
import {SysCode} from '../../_models/syscode';

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
  selector: 'app-browse_config.dialog',
  templateUrl: '../../dialogs/browse/browse_config.dialog.html',
  styleUrls: ['../../dialogs/browse/browse_config.dialog.css'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}
]
})
export class BrowseConfigDialogComponent {
	
	public categories: SysCode[];
	
  constructor(public dialogRef: MatDialogRef<BrowseConfigDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataServiceConfig) { }
			  
	ngOnInit()  
    {  
		var array = new Array();
		for (let category of this.data.categories) {
			array.push(category.category);
		}
		const uniqueSet = new Set(array);
		this.categories = Array.from(uniqueSet);
    }  
			  

  formControl = new FormControl('', [
  
  ]);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
