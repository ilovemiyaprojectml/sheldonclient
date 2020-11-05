
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

import {DataService} from '../_services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {UserA} from '../_models/usera';
import {DataSource} from '@angular/cdk/collections';
import {AddDialogComponent} from '../dialogs/add/add.dialog.component';
import {BrowseDialogComponent} from '../dialogs/browse/browse.dialog.component';
import {EditDialogComponent} from '../dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from '../dialogs/delete/delete.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {SseService} from '../_services/sse.service';


@Component({
  selector: 'miya-admin-adduser',
  templateUrl: './admin-adduser.component.html',
  styleUrls: ['./admin-adduser.component.scss']
})

  
export class AdminAddUserComponent implements OnInit {
	
	currentUser = JSON.parse(this.cookieService.get('currentUser'));
	
	//displayedColumns = ['user_id', 'eid', 'firstname', 'lastname', 'email', 'role', 'effective_start_date', 'effective_end_date', 'date_created', 'date_last_updated', 'created_by', 'last_updated_by', 'is_active', 'actions'];
	displayedColumns = ['user_id', 'eid', 'firstname', 'lastname', 'email', 'role', 'manager', 'effective_start_date', 'effective_end_date', 'is_active', 'actions'];
	exampleDatabase: DataService | null;
	dataSource: ExampleDataSource | null;
	index: number;
	user_id: number;
	
	 

   constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: DataService,
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

	addNew(usera: UserA) {
	const dialogRef = this.dialog.open(AddDialogComponent, {
	  data: {usera: usera, managers : this.exampleDatabase.dataManager.value }
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
	
	startBrowse(i: number, user_id: number, eid: string, firstname: string, lastname: string, email: string, role: string, manager: string, effective_start_date: string, effective_end_date: string, date_created: string, date_last_updated: string, created_by: string, last_updated_by: string, is_active: string) {
	this.user_id = user_id;
	this.index = i;
	console.log(this.index);
	const dialogRef = this.dialog.open(BrowseDialogComponent, {
	  data: {user_id: user_id, eid: eid, firstname: firstname, lastname: lastname, email: email, role: role, manager: manager, effective_start_date: effective_start_date, effective_end_date: effective_end_date, date_created: date_created, date_last_updated: date_last_updated, created_by: created_by, last_updated_by: last_updated_by, is_active: is_active, managers : this.exampleDatabase.dataManager.value}
	});

	dialogRef.afterClosed().subscribe(result => {
	  if (result === 1) {
		const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.user_id === this.user_id);
		this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
		this.refreshTable();
	  }
	});
	}

	startEdit(i: number, user_id: number, eid: string, firstname: string, lastname: string, email: string, role: string, manager: string, effective_start_date: string, effective_end_date: string, date_created: string, date_last_updated: string, created_by: string, last_updated_by: string, is_active: string) {
	this.user_id = user_id;
	this.index = i;
	console.log(this.index);
	const dialogRef = this.dialog.open(EditDialogComponent, {
	  data: {user_id: user_id, eid: eid, firstname: firstname, lastname: lastname, email: email, role: role, manager: manager, effective_start_date: effective_start_date, effective_end_date: effective_end_date, date_created: date_created, date_last_updated: date_last_updated, created_by: created_by, last_updated_by: last_updated_by, is_active: is_active, managers : this.exampleDatabase.dataManager.value}
	});

	dialogRef.afterClosed().subscribe(result => {
	  if (result === 1) {
		const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.user_id === this.user_id);
		this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
		setTimeout(() => {
				this.refresh();
				this.refreshTable();
			  }, 1500);
	  }
	});
	}

	deleteItem(i: number, user_id: number, eid: string, firstname: string, lastname: string, email: string, role: string, manager: string, effective_start_date: string, effective_end_date: string, date_created: string, date_last_updated: string, created_by: string, last_updated_by: string, is_active: string) {
	this.index = i;
	this.user_id = user_id;
	const dialogRef = this.dialog.open(DeleteDialogComponent, {
	  data: {user_id: user_id, eid: eid, firstname: firstname, lastname: lastname, email: email, role: role, manager: manager, effective_start_date: effective_start_date, effective_end_date: effective_end_date, date_created: date_created, date_last_updated: date_last_updated, created_by: created_by, last_updated_by: last_updated_by, is_active: is_active, managers : this.exampleDatabase.dataManager.value}
	});

	dialogRef.afterClosed().subscribe(result => {
	  if (result === 1) {
		const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.user_id === this.user_id);
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
	this.exampleDatabase = new DataService(this.httpClient);
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



export class ExampleDataSource extends DataSource<UserA> {
	_filterChange = new BehaviorSubject('');

	get filter(): string {
	return this._filterChange.value;
	}

	set filter(filter: string) {
	this._filterChange.next(filter);
	}

	filteredData: UserA[] = [];
	renderedData: UserA[] = [];

	constructor(public _exampleDatabase: DataService,
			  public _paginator: MatPaginator,
			  public _sort: MatSort,
			  private router: Router,
			private auth: AuthenticationService) {
	super();
	this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
	}

	connect(): Observable<UserA[]> {
	const displayDataChanges = [
	  this._exampleDatabase.dataChange,
	  this._sort.sortChange,
	  this._filterChange,
	  this._paginator.page
	];

	this._exampleDatabase.getAllUsers();
	this._exampleDatabase.getAllManagers();
	


	return merge(...displayDataChanges).pipe(map( () => {
		this.filteredData = this._exampleDatabase.data.slice().filter((usera: UserA) => {
		  const searchStr = (usera.user_id + usera.eid + usera.firstname + usera.lastname).toLowerCase();
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


	sortData(data: UserA[]): UserA[] {
	if (!this._sort.active || this._sort.direction === '') {
	  return data;
	}

	return data.sort((a, b) => {
	  let propertyA: number | string = '';
	  let propertyB: number | string = '';

	  switch (this._sort.active) {
		  case 'user_id': [propertyA, propertyB] = [a.user_id, b.user_id]; break;
		case 'eid': [propertyA, propertyB] = [a.eid, b.eid]; break;
		case 'firstname': [propertyA, propertyB] = [a.firstname, b.firstname]; break;
		case 'lastname': [propertyA, propertyB] = [a.lastname, b.lastname]; break;
		case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
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


