
import { Injectable } from '@angular/core';
import { Component, OnInit, Input , ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { first } from 'rxjs/operators';



import { AuthenticationService } from '../_services';
import { pipe } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../_models';
import { CurrentshiftService } from '../_services/currentshift.service';



import { HttpClient } from '@angular/common/http';
import { constants } from '../core/constants';

import {DataServiceConfig} from '../_services/data_config.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {SysCode} from '../_models/syscode';
import {DataSource} from '@angular/cdk/collections';
import {AddConfigDialogComponent} from '../dialogs/add/add_config.dialog.component';
import {BrowseConfigDialogComponent} from '../dialogs/browse/browse_config.dialog.component';
import {EditConfigDialogComponent} from '../dialogs/edit/edit_config.dialog.component';
import {DeleteConfigDialogComponent} from '../dialogs/delete/delete_config.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {SseService} from '../_services/sse.service';


@Component({
  selector: 'miya-admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss']
})

  
export class AdminConfigComponent implements OnInit {
	
	currentUser = JSON.parse(this.cookieService.get('currentUser'));
	
	displayedColumns = ['code_id', 'code_name', 'desc', 'category', 'value_1', 'value_2', 'value_3', 'value_4', 'is_active', 'actions'];
	exampleDatabase: DataServiceConfig | null;
	dataSource: ExampleDataSource | null;
	index: number;
	code_id: number;
	
	 

   constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: DataServiceConfig,
			  private router: Router,
			private auth: AuthenticationService, private cookieService: CookieService, public sseService: SseService){}
			  
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	@ViewChild('filter',  {static: true}) filter: ElementRef;

	ngOnInit() {

		this.loadData();

	}
	
	refresh() {
	this.loadData();
	}

	addNew(usera: SysCode) {
	const dialogRef = this.dialog.open(AddConfigDialogComponent, {
	  data: {usera: usera, categories : this.exampleDatabase.dataChange.value }
	});

	dialogRef.afterClosed().subscribe(result => {
	  if (result === 1) {
		this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
		setTimeout(() => {
				this.refresh();
				this.refreshTable();
			  }, 1500);
		
	  }
	});
	}
	
	startBrowse(i: number, code_id: number, code_name: string, desc: string, category: string, value_1: string, value_2: string, value_3: string, value_4: string, date_created: string, date_last_updated: string, created_by: string, last_updated_by: string, is_active: string) {
	this.code_id = code_id;
	this.index = i;
	console.log(this.index);
	const dialogRef = this.dialog.open(BrowseConfigDialogComponent, {
	  data: {code_id: code_id, code_name: code_name, desc: desc, category: category, value_1: value_1, value_2: value_2, value_3: value_3, value_4: value_4, date_created: date_created, date_last_updated: date_last_updated, created_by: created_by, last_updated_by: last_updated_by, is_active: is_active, categories : this.exampleDatabase.dataChange.value}
	});

	dialogRef.afterClosed().subscribe(result => {
	  if (result === 1) {
		const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.code_id === this.code_id);
		this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
		this.refreshTable();
	  }
	});
	}

	startEdit(i: number, code_id: number, code_name: string, desc: string, category: string, value_1: string, value_2: string, value_3: string, value_4: string, date_created: string, date_last_updated: string, created_by: string, last_updated_by: string, is_active: string) {
	this.code_id = code_id;
	this.index = i;
	console.log(this.index);
	const dialogRef = this.dialog.open(EditConfigDialogComponent, {
	  data: {code_id: code_id, code_name: code_name, desc: desc, category: category, value_1: value_1, value_2: value_2, value_3: value_3, value_4: value_4, date_created: date_created, date_last_updated: date_last_updated, created_by: created_by, last_updated_by: last_updated_by, is_active: is_active, categories : this.exampleDatabase.dataChange.value}
	});

	dialogRef.afterClosed().subscribe(result => {
	  if (result === 1) {
		const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.code_id === this.code_id);
		this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
		setTimeout(() => {
				this.refresh();
				this.refreshTable();
			  }, 1500);
	  }
	});
	}

	deleteItem(i: number, code_id: number, code_name: string, desc: string, category: string, value_1: string, value_2: string, value_3: string, value_4: string, date_created: string, date_last_updated: string, created_by: string, last_updated_by: string, is_active: string) {
	this.index = i;
	this.code_id = code_id;
	const dialogRef = this.dialog.open(DeleteConfigDialogComponent, {
	  data: {code_id: code_id, code_name: code_name, desc: desc, category: category, value_1: value_1, value_2: value_2, value_3: value_3, value_4: value_4, date_created: date_created, date_last_updated: date_last_updated, created_by: created_by, last_updated_by: last_updated_by, is_active: is_active, categories : this.exampleDatabase.dataChange.value}
	});

	dialogRef.afterClosed().subscribe(result => {
	  if (result === 1) {
		const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.code_id === this.code_id);
		this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
		setTimeout(() => {
				this.refresh();
				this.refreshTable();
			  }, 1500);
	  }
	});
	}


	private refreshTable() {
	this.paginator._changePageSize(this.paginator.pageSize);
	}




	public loadData() {
	this.exampleDatabase = new DataServiceConfig(this.httpClient);
	this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, this.router, this.auth);
	fromEvent(this.filter.nativeElement, 'keyup')
	  .subscribe(() => {
		if (!this.dataSource) {
		  return;
		}
		this.dataSource.filter = this.filter.nativeElement.value;
	  });
	}
	
	logout(){
		this.sseService.closeConnectSource();
		this.sseService.closeMissNotifSource();
		this.auth.logout();
	}

	emp(){
	this.router.navigate(['/user-dashboard']);

	}

	adduser(){
	this.router.navigate(['/admin-usermgt']);

	}

	config(){
	this.router.navigate(['/admin-config']);

	}
	
	report(){
	this.router.navigate(['/admin-report']);

	}


	onSubmit(){
	
	}
}



export class ExampleDataSource extends DataSource<SysCode> {
	_filterChange = new BehaviorSubject('');

	get filter(): string {
	return this._filterChange.value;
	}

	set filter(filter: string) {
	this._filterChange.next(filter);
	}

	filteredData: SysCode[] = [];
	renderedData: SysCode[] = [];

	constructor(public _exampleDatabase: DataServiceConfig,
			  public _paginator: MatPaginator,
			  public _sort: MatSort,
			  private router: Router,
			private auth: AuthenticationService) {
	super();
	this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
	}

	connect(): Observable<SysCode[]> {
	const displayDataChanges = [
	  this._exampleDatabase.dataChange,
	  this._sort.sortChange,
	  this._filterChange,
	  this._paginator.page
	];

	this._exampleDatabase.getAllSysCodes();
	


	return merge(...displayDataChanges).pipe(map( () => {
		this.filteredData = this._exampleDatabase.data.slice().filter((usera: SysCode) => {
		  const searchStr = (usera.code_id + usera.code_name + usera.desc + usera.category + usera.value_1 + usera.value_2 + usera.value_3 + usera.value_4).toLowerCase();
		  return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
		});

		const sortedData = this.sortData(this.filteredData.slice());

		const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
		this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
		return this.renderedData;
	  }
	));
	}

	disconnect() {}


	sortData(data: SysCode[]): SysCode[] {
	if (!this._sort.active || this._sort.direction === '') {
	  return data;
	}

	return data.sort((a, b) => {
	  let propertyA: number | string = '';
	  let propertyB: number | string = '';

	  switch (this._sort.active) {
		  case 'code_id': [propertyA, propertyB] = [a.code_id, b.code_id]; break;
		case 'code_name': [propertyA, propertyB] = [a.code_name, b.code_name]; break;
		case 'desc': [propertyA, propertyB] = [a.desc, b.desc]; break;
		case 'category': [propertyA, propertyB] = [a.category, b.category]; break;
		case 'value_1': [propertyA, propertyB] = [a.value_1, b.value_1]; break;
		case 'value_2': [propertyA, propertyB] = [a.value_2, b.value_2]; break;
		case 'value_3': [propertyA, propertyB] = [a.value_3, b.value_3]; break;
		case 'value_4': [propertyA, propertyB] = [a.value_4, b.value_4]; break;
		//case 'disp': [propertyA, propertyB] = [a.display, b.display]; break;
		//case 'role': [propertyA, propertyB] = [a.role, b.role]; break;
		//case 'effective_start_date': [propertyA, propertyB] = [a.effective_start_date, b.effective_start_date]; break;
		//case 'effective_end_date': [propertyA, propertyB] = [a.effective_end_date, b.effective_end_date]; break;
		//case 'date_created': [propertyA, propertyB] = [a.date_created, b.date_created]; break;
		//case 'date_last_updated': [propertyA, propertyB] = [a.date_last_updated, b.date_last_updated]; break;
		case 'created_by': [propertyA, propertyB] = [a.created_by, b.created_by]; break;
		case 'last_updated_by': [propertyA, propertyB] = [a.last_updated_by, b.last_updated_by]; break;
		//case 'is_active': [propertyA, propertyB] = [a.is_active, b.is_active]; break;
	  }

	  const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
	  const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

	  return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
	});
	}

}


