import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NewShift } from '../_models/newshift.model';
import { AuthenticationService, ConstantsService, LoggerService, ShiftService } from '../_services';
import { constants } from '../core/constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ShiftnotifService } from '../_services/shiftnotif.service';
import {SseService} from '../_services/sse.service';

@Component({
  selector: 'miya-shift-schedule-create',
  templateUrl: './shift-schedule-create.component.html',
  styleUrls: ['./shift-schedule-create.component.scss']
})
export class ShiftScheduleCreateComponent implements OnInit {
  // declaration
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  allowedBreaks: number;

  showLogo = false;
  time = {hour: 13, minute: 30};
  newShiftForm: FormGroup;
  
  submitBtnDisabled = false;

  
 constructor(private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private cookieService: CookieService, 
    private newShiftService: ShiftService,
    private auth: AuthenticationService,
    private router: Router,
    private constantsService: ConstantsService,
    private logger: LoggerService,
    private http: HttpClient,
    private shiftnotif: ShiftnotifService, public sseService: SseService) { }

    currentUser: any;
    title = "";
    isAuthorized = false;
 
  ngOnInit() {
    
    this.logger.debug("ngOnInit() - Start");

    this.newShiftForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      startTime: ['',Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      allowedBreaks: ['', Validators.required]
    });
    
    this.isAuthorized = this.cookieService.check('currentUser') == true; 
    if (!(this.isAuthorized)) {
      this.logger.debug("Unknown User Redirecting to Login Page");
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(this.cookieService.get('currentUser'));
    this.title = "Welcome, " + this.currentUser.firstName;
    this.logger.debugObject("currentUser : ", this.currentUser.username);
    
    // initialise values
    this.submitBtnDisabled = false;
    this.startDate = new Date();
    this.startTime = ('0' + this.startDate.getHours()).slice(-2) + ':' + ('0' + this.startDate.getMinutes()).slice(-2);
    this.endDate = new Date();
    this.endTime = this.startTime;
    this.allowedBreaks = 0;
    
    this.logger.debug("constructor(): startDate - " + this.startDate);
    this.logger.debug("constructor(): startTime - " + this.startTime);
    
    this.checkExistingShift();
    
    this.newShiftForm.setValue({
      startDate: this.startDate,
      startTime: this.startTime,
      endDate: this.endDate,
      endTime: this.endTime,
      allowedBreaks: this.allowedBreaks
    });
    
    //get system allowed breaks configuration
    this.setSystemAllowedBreaks(); 

    this.onStartTimeChange();
    
    this.logger.debug("ngOnInit() - End");
  }

  get formValues(){
    return this.newShiftForm.controls;
  }


  
  onSubmit(){
    this.logger.debug("onSubmit() - Start"); 
    
    if (this.submitBtnDisabled == true) { 
      this.logger.debug("onSubmit() - Already Submitted"); 
      return; 
    };
    
    this.submitBtnDisabled = true;
    
    let startDateFormat = this.datePipe.transform(this.formValues.startDate.value, this.constantsService.DATE_FORMAT_DATABASE);
    let startTimeFormat = this.formValues.startTime.value;
    let endDateFormat = this.datePipe.transform(this.formValues.endDate.value, this.constantsService.DATE_FORMAT_DATABASE);
    let endTimeFormat = this.formValues.endTime.value;
    let allowedBreaks = this.formValues.allowedBreaks.value;
    
    let shift = new NewShift(startDateFormat, startTimeFormat, endDateFormat, endTimeFormat, allowedBreaks);

    if (this.newShiftForm.invalid) {
      alert("Invalid!"); // add meaningful alert later!
      return;
    }
    
    let userid = this.currentUser.userId;
    
    this.newShiftService.validateShift(shift, userid)
    .pipe(first())
    .subscribe(
      data => {
        if(data.data.startsWith("ERROR")){
          this.logger.debug("[" + data.data + "]");
          alert(data.data);
          this.submitBtnDisabled = false;
          return;
        }
        else{
          this.logger.debug("Shift Succesfully Validated!");
          
          this.newShiftService.newshift(shift, userid)
          .pipe(first())
          .subscribe(
            data => {
              this.logger.debug("Shift Succesfully Created!");
              alert("Shift Succesfully Created!");
              
              if (this.currentUser.role.indexOf('roleCd=MANAGER') > -1) {
                this.logger.debug("Routing to root-dashboard");
                this.router.navigate(['/root-dashboard']);
              } else {
                this.logger.debug("Routing to user-dashboard");
                this.router.navigate(['/user-dashboard']); 
              }
          });
        }
      }
    );
    
    this.logger.debug("onSubmit() - End");
  }  
  
  
  
  logout(){
  	this.sseService.closeConnectSource();
	this.sseService.closeMissNotifSource();
    this.auth.logout();

  }

  
  onStartDateChange(): void{
    this.logger.debug("onStartDateChange - Begin");
    
    // For any implementation on Date only

    this.onStartTimeChange();
    
    this.logger.debug("onStartDateChange - End");
  } 

  
  onStartTimeChange(): void{
    this.logger.debug("onStartTimeChange - Begin");
    
    let startTimeFormat = this.formValues.startTime.value;
    let endTimeHours = startTimeFormat.substring(0,2);
    let endTimeMinutes = startTimeFormat.slice(3);
    let endDate = new Date(this.datePipe.transform(this.formValues.startDate.value, this.constantsService.DATE_FORMAT_DISPLAY));

    // Add 9 hours to End Time
    this.logger.debug("Adding 9 hours to End Time");
    endTimeHours = parseInt(endTimeHours) + 9;
    if (parseInt(endTimeHours) == 24) {
      this.logger.debug("setting to 00 hours [" + endTimeHours + "]");
      endTimeHours = '00';
      
      this.logger.debug("Adding one day to End Date since End Hour falls on Midnight 00:00");
      endDate.setDate(endDate.getDate() + 1);
      
    } else if (parseInt(endTimeHours) > 24) {
      this.logger.debug("greater than 24 hours");
      this.logger.debug("deducting 24 hours [" + endTimeHours + "]");
      endTimeHours = parseInt(endTimeHours) - 24;
      endTimeHours = ('0' + endTimeHours).slice(-2);

      this.logger.debug("Adding one day to End Date since End Hour falls on next day");
      endDate.setDate(endDate.getDate() + 1);
    }
    
    this.logger.debug("constructor(): endTimeHours - " + endTimeHours);
    this.logger.debug("constructor(): endTimeMinutes - " + endTimeMinutes);
    
    this.newShiftForm.patchValue({
      endTime: endTimeHours + ":" + endTimeMinutes
    });
    
    this.newShiftForm.patchValue({
      endDate: endDate
    });

    this.updateAllowedBreaks(90);

    this.logger.debug("onStartTimeChange - End");
  }

  checkExistingShift(): void{
    this.logger.debug("checkExistingShift - Start");
    this.shiftnotif.getShiftNotif("-", this.currentUser.userId).pipe().subscribe(data =>{
      if (data.shiftSchedId != null && data.shiftSchedId != 0){
        this.logger.debugObject("checkExistingShift - Current Shift ID Exist: ", data);
        
        if (this.currentUser.role.indexOf('roleCd=MANAGER') > -1) {
          this.logger.debug("Routing to root-dashboard");
          this.router.navigate(['/root-dashboard']);
        } else {
          this.logger.debug("Routing to user-dashboard");
          this.router.navigate(['/user-dashboard']); 
        }
        
      }
    }); 
    
    this.logger.debug("checkExistingShift - End");
  }

  updateAllowedBreaks(newValue): void{
    this.logger.debug("updateAllowedBreaks - Start");

    this.newShiftForm.patchValue({
      allowedBreaks: newValue * 60
    });

    this.allowedBreaks = newValue;

    this.logger.debug("updateAllowedBreaks - End");
  }

  onEndDateTimeChange(): void {
    this.logger.debug("onEndDateTimeChange - Start");

    let startDateFormat = this.formValues.startDate.value;
    let startTimeFormat = this.formValues.startTime.value;
    let startTimeHours = startTimeFormat.substring(0,2);
    let startTimeMinutes = startTimeFormat.slice(3);
    var newStartDate = new Date(startDateFormat);
    newStartDate.setHours(startTimeHours,startTimeMinutes,0,0); 

    let endDateFormat = this.formValues.endDate.value;
    let endTimeFormat = this.formValues.endTime.value;
    let endTimeHours = endTimeFormat.substring(0,2);
    let endTimeMinutes = endTimeFormat.slice(3);
    var newEndDate = new Date(endDateFormat);
    newEndDate.setHours(endTimeHours,endTimeMinutes,0,0); 

    var hoursDiff = Math.abs(newStartDate.getTime() - newEndDate.getTime()) / 36e5;

    this.updateAllowedBreaks(this.getAllowedBreaks(hoursDiff));

    this.logger.debug("onEndDateTimeChange - End");
  }

  //This returns values in minutes format
  getAllowedBreaks(hoursShift) {
    this.logger.debug("getAllowedBreaks - Start");
    var sysAllowedBreakTimes = JSON.parse(this.cookieService.get('allowedBreakTimes'));

    var numDays = 0;
    if (hoursShift > 24){
      numDays = Math.floor(hoursShift / 24);
      hoursShift = hoursShift % 24;
    }

    var allowedBreaks = 0;
    var minBreakFor1Day = 0;
    for (var i = 0; i < sysAllowedBreakTimes.length; i++) {
      if (hoursShift > parseInt(sysAllowedBreakTimes[i].value_1) && hoursShift <= parseInt(sysAllowedBreakTimes[i].value_2)){
        allowedBreaks = parseInt(sysAllowedBreakTimes[i].value_3);
      }

      if (parseInt(sysAllowedBreakTimes[i].value_2) == 24){
        minBreakFor1Day = parseInt(sysAllowedBreakTimes[i].value_3);
      }
    } 

    var additionalBreaks = numDays * minBreakFor1Day;
    allowedBreaks = additionalBreaks + allowedBreaks;

    this.logger.debug("getAllowedBreaks - End");
    return allowedBreaks;
  }

  setSystemAllowedBreaks(): void{
    this.logger.debug("setSystemAllowedBreaks - Start");
    this.newShiftService.getSysAllowedBreaks()
      .pipe(first())
      .subscribe(
        data => {
          this.logger.debug("system allowed breaks fetched.");
      });
    this.logger.debug("setSystemAllowedBreaks - Start");
  }

}
