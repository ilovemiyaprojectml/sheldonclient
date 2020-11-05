import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import {Component, OnInit, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {UserA} from '../_models/usera';
import {Report} from '../_models/report';
import { AuthenticationService } from '../_services';
import {SseService} from '../_services/sse.service';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { constants } from '../core/constants';

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
  selector: 'miya-report-admin',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}
]
})

  
export class AdminReportComponent implements OnInit {

  currentUser = JSON.parse(this.cookieService.get('currentUser'));
  
  loginForm: FormGroup;
  
  public managers: UserA[];
  public users: UserA[];
  
  
  private readonly API_URL = `${constants.API_URL}`;

	dataManager: BehaviorSubject<UserA[]> = new BehaviorSubject<UserA[]>([]);
	dataUser: BehaviorSubject<UserA[]> = new BehaviorSubject<UserA[]>([]);
  
   constructor(private formBuilder: FormBuilder, private router: Router,
	  private auth: AuthenticationService,
	  private cookieService: CookieService,
	  public sseService: SseService, public httpClient: HttpClient
	  ) { 
	  
	  }

	ngOnInit() {
		this.getAllUsers();
		this.getAllManagers();
		this.loginForm = this.formBuilder.group({
		  emp: '',
		  mgr: '',
		  scheddatefrom: '',
		  scheddateto: '',
		  type: 'Default',
		  format: 'PDF',
		  status: ''
		  
		});
	}

	getAllManagers(): void {
		
	this.httpClient.get<UserA[]>(this.API_URL + '/getallmanagers', {params: {withAll: '0'}}).subscribe(data => {
		this.dataManager.next(data);
		this.managers = this.dataManager.value;
	  },
	  (error: HttpErrorResponse) => {
	  console.log (error.name + ' ' + error.message);
	  });
	}
	
	getAllUsers(): void {
		
	this.httpClient.get<UserA[]>(this.API_URL + '/getallusersdp', {params: {withAll: '0'}}).subscribe(data => {
		this.dataUser.next(data);
		this.users = this.dataUser.value;
	  },
	  (error: HttpErrorResponse) => {
	  console.log (error.name + ' ' + error.message);
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
  
  reset(){
    this.loginForm = this.formBuilder.group({
		  emp: '',
		  mgr: '',
		  scheddatefrom: '',
		  scheddateto: '',
		  type: 'Default',
		  format: 'PDF',
		  status: ''
		  
		});

  }
  
  

  get formValues(){
    return this.loginForm.controls;
  }
  
  report : any;
  
  onSubmit(){
	  //let data1: any = Object.assign(this.loginForm.value);
	  
	  this.report = new Report();
	  
	  var arr:string[] = new Array();
	  if (this.formValues.emp.value == '' || this.formValues.emp.value == null) {
		  this.report.emp = arr;
	  } else {
		  this.report.emp = this.formValues.emp.value;
	  }
	  
	  if (this.formValues.mgr.value == '' || this.formValues.mgr.value == null) {
		  this.report.mgr = arr;
	  } else {
		  this.report.mgr = this.formValues.mgr.value;
	  }
	  
	  if (this.formValues.status.value == '' || this.formValues.status.value == null) {
		  this.report.status = arr;
	  } else {
		  this.report.status = this.formValues.status.value;
	  }
	  
	  if (this.formValues.scheddatefrom.value == '') {
		  this.report.scheddatefrom = null;
	  } else {
		  this.report.scheddatefrom = this.formValues.scheddatefrom.value;
	  }
	  
	  if (this.formValues.scheddateto.value == '') {
		  this.report.scheddateto = null;
	  } else {
		  this.report.scheddateto = this.formValues.scheddateto.value;
	  }
	  
	  if (this.formValues.type.value == '' || this.formValues.type.value == null) {
		  this.report.type = 'Default';
	  } else {
		  this.report.type = this.formValues.type.value;
	  }
	  
	  if (this.formValues.format.value == '' || this.formValues.format.value == null) {
		  this.report.format = 'PDF';
	  } else {
		  this.report.format = this.formValues.format.value;
	  }
	  
	  this.report.last_updated_by = this.currentUser.userId;
	  
	  
	if (this.report.format == 'PDF') {			
		let headers = new HttpHeaders();
		headers = headers.set('Accept', 'application/pdf');
		this.httpClient.post(this.API_URL + '/generatereportpdf', this.report, {headers: headers, responseType: 'blob'}).subscribe(data => {
						var blob = new Blob([(<any>data)], { type: 'application/pdf' });
						//var url = window.URL.createObjectURL(blob);
						//window.open(url);
						
						var link = document.createElement('a');
				        link.href = window.URL.createObjectURL(blob);
				        link.download = "FIS Work From Home Report.pdf";
				        link.click();
					},
		  (err: HttpErrorResponse) => {
			alert('Generate Report Failed!'); 
		  }
		);
	} else if (this.report.format == 'XLS') {
		let headers = new HttpHeaders();
		headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		this.httpClient.post(this.API_URL + '/generatereportxls', this.report, {headers: headers, responseType: 'blob'}).subscribe(data => {
						var blob = new Blob([(<any>data)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
						//var url = window.URL.createObjectURL(blob);
						//window.open(url);
						
						var link = document.createElement('a');
				        link.href = window.URL.createObjectURL(blob);
				        link.download = "FIS Work From Home Report.xlsx";
				        link.click();
					},
		  (err: HttpErrorResponse) => {
			alert('Generate Report Failed!'); 
		  }
		);
	}
	
	/*this.httpClient.get(this.API_URL + '/generatereport1', {headers: headers, responseType: 'blob'}).subscribe(data => {
                    var blob = new Blob([(<any>data)], { type: 'application/pdf' });
                    var url = window.URL.createObjectURL(blob);
                    window.open(url);
                },
                err => {
                },
                () => { });*/
  }
  
  
  
  
  
  
  

}


