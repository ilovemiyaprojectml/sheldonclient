
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { OnInit, HostListener, Host, Inject, ChangeDetectionStrategy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthenticationService, ShiftService } from '../_services';
import { constants } from '../core/constants';
import { PushNotificationsService } from 'ng-push';
import { DOCUMENT } from '@angular/common';
import { TitleBlinkerService, LoggerService, UserpreferencesService } from '../_services';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ShiftnotifService } from '../_services/shiftnotif.service';
import { RootDashboardService } from '../_services/rootdashboard.service';
import { UserIdModel } from '../_models/userid.model';
import { AckModel } from '../_models/ack.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material';

import {SseService} from '../_services/sse.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';


@Component({
  selector: 'miya-root-dashboard',
  templateUrl: './root-dashboard.component.html',
  styleUrls: ['./root-dashboard.component.scss']
})
export class RootDashboardComponent implements OnInit  {

  selectedNavPath: string;
  selectedPath: string;
  selectedPath1: string;
  count = 6;
  backgroundColor: string;
  defaultTabIndex = 0;
  isShowMyShiftTab = false;

  //currentUser = JSON.parse(this.cookieService.get('currentUser'));
  
  model: NgbDateStruct;
  badgeCounter = 0;
  date: {year: number, month: number, day: number};
  editing = {};
  rows = [];
  rowsdr = [];
  allDate = [];
  pending = [];
  pending_nonpersistent_array = [];
  
  private dateIndex = 0;

  color = 'primary';
  showMenubar = true;
  showLogo = false;
  matBadge = 1;
  showBadge = false;

  hasShift = true;
  isEndShiftTriggered = false;

  currentShiftSchedId = 0;
  selectedShiftSchedId = 0;
  minShiftSchedId = 0;
  maxShiftSchedId = 0;
  displayRows = [];
  displayEmpRows = [];

  /*Event Sources*/
  connectSource = null;
  missNotifSource = null;
  shiftNotifSource = null;

  currentUser: any;
  title = "";
  isAuthorized = false;

  remainingBreakTime = "0 mins";
  breakTimeInMins = 1;

  popupAlertMap = new Map();
  popupAlertSoundMap = new Map();

  userPreferencesMap = new Map();
  
  directrepColumns = [
    {
      prop: 'no',
      name: '#'
    },
    {
      prop: 'name',
      name: 'Name'
    },
    {
      prop: 'starttime',
      name: 'Start Time'
    },
    {
      prop: 'endtime',
      name: 'End Time'
    }, 
    {
      prop: 'actualendtime',
      name: 'Actual End Time'
    }, 
    {
      prop: 'missednotifs',
      name: 'Missed Notifications'
    }
  ]


  constructor(private cookieService: CookieService, private auth: AuthenticationService,
    private pushNotifications: PushNotificationsService, @Inject(DOCUMENT) private _document: HTMLDocument
    ,private blinker: TitleBlinkerService, private calendar: NgbCalendar, private rootdash: RootDashboardService, private shiftnotif: ShiftnotifService,
    private shift: ShiftService, private snackbar: MatSnackBar, private router: Router, 
    private logger: LoggerService, public sseService: SseService, public userpreferencesService: UserpreferencesService,
    private dialog: MatDialog, private overlay: Overlay) {

    this.isAuthorized = this.cookieService.check('currentUser') == true; 
    if (!(this.isAuthorized)) {
      this.logger.debug("Unknown User Redirecting to Login Page");
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(this.cookieService.get('currentUser'));
    this.title = `Welcome, ${this.currentUser.firstName} ${this.currentUser.lastName}`;


    console.log("initialize user preferences...");
    console.log(this.currentUser.userOptions);
    //set the user preferces like alert sound ON/OFF
    for (var i = 0; i < this.currentUser.userOptions.length; i++) {
      this.userPreferencesMap.set(this.currentUser.userOptions[i].optionCode,this.currentUser.userOptions[i].optionValue);
    } 

    this.pushNotifications.requestPermission();

    let badgeCounterItem = localStorage.getItem('badgeCounter');
    if (badgeCounterItem != null && badgeCounterItem.length > 0 && Number(badgeCounterItem) > 0) {
      this.badgeCounter = Number(badgeCounterItem);
    } else {
      this.badgeCounter = 0;
    }

    this.isEndShiftTriggered = false;
    this.logger.debug("constructor(): isEndShiftTriggered - " + this.isEndShiftTriggered);
    
    if (this.rows.length > 0){
      this.hasShift = true;
    } else {
      this.hasShift = false;
    }
    
    if (this.currentUser.role.indexOf('roleCd=EMPLOYEE') > -1) {
      this.logger.debug("Defaulting to MyShift View");
      this.isShowMyShiftTab = true;
      this.defaultTabIndex = 1;
    }
    
    this.connect();
    this.missNotify();
    this.shiftNotif();
    this.retrieveShiftNotif();
    this.getPending();  
    this.retrieveDirectReports();
  }

  ngOnInit() {
    
    
  }
  
   ngOnDestroy() {
    this.logger.debug("ngOnDestroy() - Start");
    this.popupAlertMap.clear();
    this.logger.debug("ngOnDestroy() - End");
    
  }

  connect(): void{
    this.sseService.setConnectSource(`${constants.API_URL}/notification/${this.currentUser.userId}`); //new EventSource(`${constants.API_URL}/notification/${this.currentUser.userId}`);
    this.sseService.getConnectSource().addEventListener(this.currentUser.userId, message =>{
        this.notifyPopup("Something", "Hi " + this.currentUser.firstName + "! You have pending reminder!", message.data);
        this.blinker.blink("New Notification", 20);

        this.badgeCounter = this.badgeCounter + 1;
        localStorage.setItem('badgeCounter', String(this.badgeCounter));
          
        this._document.getElementById('fisIcon').setAttribute('href', '../../assets/loginBackgrounds/faviconnotif.png');
        this.retrieveShiftNotif();
    });
  }


  missNotify() {
      this.logger.debug("missNotify() - Start");
      this.sseService.setMissNotifSource(`${constants.API_URL}/notification/missalert/${this.currentUser.userId}`); //new EventSource(`${constants.API_URL}/notification/missalert/${this.currentUser.userId}`);
      this.sseService.getMissNotifSource().addEventListener(this.currentUser.userId, message =>{
        var dataObj = JSON.parse(message.data);  
        if ('missendshift' == dataObj.emitterString) {
          this.playAudio(0, "../../assets/sounds/beep-02.mp3");
          this.removePopupAlert(dataObj.schedTime.schedTimeId);
          this.logger.debugObject("missNotify() - triggered", dataObj.emitterString);
          this.missEndShift();
        } else if ('breakTimeBatchJob' == dataObj.emitterString){
          this.breakTimeInMins = parseInt(dataObj.remainingBreakTime) / 60;
          this.remainingBreakTime = this.breakTimeInMins + " mins";
          if (this.breakTimeInMins <= 0){
            //programatically end the break then disable the break button
            this.onBreak('Y');
          }
        } else {
          this.playAudio(0, "../../assets/sounds/beep-02.mp3");
          this.removePopupAlert(dataObj.schedTime.schedTimeId);
          this.logger.debugObject("missNotify() - triggered", dataObj.emitterString);
          this.retrieveShiftNotif();
          if (this.badgeCounter > 0) {
            this.badgeCounter = this.badgeCounter - 1;
            localStorage.setItem('badgeCounter', String(this.badgeCounter));
          }
        }
        if (dataObj.empName != "") {
          this.logger.debugObject("missNotify() - triggered", dataObj.empName);
          this.notifyPopupManager("Something", "Hi " + this.currentUser.firstName + "! Your employee, " + dataObj.empName + ", missed a pending reminder!", message.data);
          this.blinker.blink("New Notification", 20);
          this.badgeCounter = this.badgeCounter + 1;
          localStorage.setItem('badgeCounter', String(this.badgeCounter));
        }
        this.retrieveDirectReports();
      });
      
      this.logger.debug("missNotify() - End");
  }
  
  async missEndShift() {
    this.logger.debug("missEndShift() - Start");
    
    let result = await this.missEndShift_sync();
    
    this.logger.debug("missEndShift() - End");
  }

  missEndShift_sync(): any {
    this.logger.debug("missEndShift_sync() - Start");
            
      if (!(this.isEndShiftTriggered)) {
        this.logger.debug("missEndShift_sync() - ending shift");
        this.isEndShiftTriggered = true; 
        this.shift.endShift(this.currentUser.userId).pipe().subscribe(data =>{
          this.snackbar.open(data.data, "Dismiss", {
            duration: 3000,
          }); 
          
          this.retrieveShiftPrevious();
          this.badgeCounter = 0;
          localStorage.setItem('badgeCounter', '0');
        
        });
      } else {
       this.logger.debug("missEndShift_sync() - shift already ended"); 
      }

    this.logger.debug("missEndShift_sync() - End");
    return true;
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    
    if (tabChangeEvent.index == 0) {
      this.retrieveDirectReports();
    } else if (tabChangeEvent.index == 1) {
      this.retrieveShiftNotif();
    }
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event:any): void{
    
    this.blinker.stop();
    this._document.getElementById('fisIcon').setAttribute('href', '../../assets/loginBackgrounds/favicon.ico');
  }


  logout(){
    this.sseService.closeConnectSource();
    this.sseService.closeMissNotifSource();
    this.sseService.closeShiftNotifSource();
    //this.connectSource.close();
    //this.missNotifSource.close();
    this.auth.logout();
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

  /**
   * retrieveDirectReports()
   * Retrieve and refresh the direct reports with shift
   * 
   * 
   */

  retrieveDirectReports(){
    this.rootdash.getDirectReportsShiftsToday(this.currentUser.userId).pipe().subscribe(data =>{

      this.rowsdr = data.directreports.map((element, index) => ({
        userid : element.user.userId,
        no : element.user.userEid,
        name: element.user.lastName+', '+element.user.firstName,
        starttime: element.schedStartDate,
        endtime: element.schedEndDate,
        actualendtime: element.actualEndDate,
        missednotifs: element.numMissedLogin,
        viewpage: ''
      }));
      //refresh the table rows
      this.rowsdr.sort((a, b) => (Number(a.missednotifs) < Number(b.missednotifs)) ? 1 : -1)
      //this.rowsdr = this.rowsdr.sort((a, b) => (a.missednotifs < b.missednotifs) ? 1 : (a.missednotifs == b.missednotifs) ? ((a.schedStartDate < b.schedStartDate) ? 1 : -1) : -1 );
      this.rowsdr = [...this.rowsdr];


      this.displayEmpRows = this.rowsdr;
      this.displayEmpRows = [...this.displayEmpRows];
      
   }, err => {

   }); 
}

  /**
   * retrieveShiftNotif()
   * Retrieve and refresh the shift notification based on date selected by user 
   * 
   * 
   */

  retrieveShiftNotif(){
      this.shiftnotif.getShiftNotif("-", this.currentUser.userId).pipe().subscribe(data =>{

        if (data.schedTimes != null){
          this.rows = data.schedTimes;
        } else {
          this.rows = [];
        }
        
        this.currentShiftSchedId = data.shiftSchedId;
        if (this.selectedShiftSchedId == 0){
          this.selectedShiftSchedId = this.currentShiftSchedId;
        }

        this.minShiftSchedId = data.firsAndLastShiftSchedIds[0]!=null?data.firsAndLastShiftSchedIds[0]:0;
        this.maxShiftSchedId = data.firsAndLastShiftSchedIds[1]!=null?data.firsAndLastShiftSchedIds[1]:0;

        this.breakTimeInMins = parseInt(data.remainingBreakTime) / 60;
        this.remainingBreakTime = this.breakTimeInMins + " mins";

        //refresh the table rows
        this.rows = [...this.rows];

        if (this.rows.length > 0){
          this.hasShift = true;
        } else {
          this.hasShift = false;
        }
        if (this.selectedShiftSchedId==0 || this.selectedShiftSchedId==this.currentShiftSchedId){
          this.displayRows = this.rows;
          this.displayRows = [...this.displayRows];
        }
     }, err => {
       this.rows = [];
       if (this.rows.length > 0){
          this.hasShift = true;
        } else {
          this.hasShift = false;
        }
        if (this.selectedShiftSchedId==0 || this.selectedShiftSchedId==this.currentShiftSchedId){
          this.displayRows = this.rows;
          this.displayRows = [...this.displayRows];
        }
     }); 
  }

  /**
   * retrieveShiftPrevious()
   * Retrieve latest historical shift based on date selected by user 
   * 
   * 
   */

  retrieveShiftPrevious(){
      this.shiftnotif.getShiftPrevious("-", this.currentUser.userId).pipe().subscribe(data =>{
        this.rows = data.schedTimes;
        //refresh the table rows
        this.rows = [...this.rows];
        this.hasShift = false;
        
        this.minShiftSchedId = data.firsAndLastShiftSchedIds[0]!=null?data.firsAndLastShiftSchedIds[0]:0;
        this.maxShiftSchedId = data.firsAndLastShiftSchedIds[1]!=null?data.firsAndLastShiftSchedIds[1]:0;

        if (this.selectedShiftSchedId==0 || this.selectedShiftSchedId==this.currentShiftSchedId){
          this.displayRows = this.rows;
          this.displayRows = [...this.displayRows];
        }
     }); 
  }

  

  // under heavy construction
  /*
  getAllDate(){ 

    this.shift.getAllDateOfShift(this.currentUser.userId).pipe().subscribe(data =>{
        this.allDate = data;
    });


  }
  */
  
  /**
   * getPending()
   * Retrieves all PENDING shift notification time of user.
   * 
   */

  getPending(){
    this.shift.getAllPendingManager(this.currentUser.userId).pipe().subscribe(data =>{
        this.pending = data;
        if (this.pending.length == 0) {
          this.badgeCounter = 0;
          localStorage.setItem('badgeCounter', '0');
        } else {
        this.badgeCounter = this.pending.length;
        localStorage.setItem('badgeCounter', String(this.badgeCounter));
      }
    });
  }
  
  /**
   * endShift()
   * This function is used to end the current shift of the user.
   * 
   * 
   */
  endShift(){
    this.logger.debug("endShift() - Start");
    var userId = new UserIdModel(this.currentUser.userId);
    this.shift.checkCurrentShift(this.currentUser.userId).pipe().subscribe(shiftSchedule =>{
        //if not null
        if(shiftSchedule){          
          this.logger.debug("logging detailed response message");
          
          this.logger.debugObject("schedEndDate: ", shiftSchedule.schedEndDate);
          this.logger.debugObject("isShiftEnded: ", shiftSchedule.isShiftEnded);
          
          let question = shiftSchedule.isShiftEnded == 'Y'? 
              "Are you sure you want to end your shift already?" :
              "You are UNDERTIME. Are you sure you want to end your shift?";
          
          var confirmation = confirm(question);
          if(confirmation == true){
            this.shift.endShift(userId).pipe().subscribe(data =>{
              this.snackbar.open(data.data, "Dismiss", {
                  duration: 3000,
              });
              
              // RMF20200312 :: Start - Retain Shift History View
              this.retrieveShiftPrevious();
              this.badgeCounter = 0;
              localStorage.setItem('badgeCounter', '0');
              // RMF20200312 :: End - Retain Shift History View  
            });   
            
          } else{
             // do nothing
          }
        }
    }); 
    this.logger.debug("endShift() - End");
  }
  
  acknowledgeNotif(schedTimeId){
      this.removePopupAlert(schedTimeId); 
      var schedId = new AckModel(schedTimeId, "");
      
      this.shift.confirmPending(schedId).pipe().subscribe(data =>{
          
          //refresh the shift notification time table
          this.retrieveShiftNotif();
          if(this.currentUser.role.indexOf('roleCd=MANAGER')> -1){
            this.retrieveDirectReports();
          }
      
      if (this.badgeCounter > 0) {
        this.badgeCounter = this.badgeCounter - 1;
          localStorage.setItem('badgeCounter', String(this.badgeCounter));
        }
      });
  }

  acknowledgeNotifManager(schedTimeId){
      this.removePopupAlert(schedTimeId); 
      var schedId = new AckModel(schedTimeId, "");
      
      this.shift.confirmPendingManager(schedId).pipe().subscribe(data =>{
          
          //refresh the shift notification time table
          this.retrieveShiftNotif();
          if(this.currentUser.role.indexOf('roleCd=MANAGER')> -1){
            this.retrieveDirectReports();
          }
      
      if (this.badgeCounter > 0) {
        this.badgeCounter = this.badgeCounter - 1;
          localStorage.setItem('badgeCounter', String(this.badgeCounter));
        }
      });
  }
  
  acknowledgeNotif_nonpersistent(id){
    this.removePopupAlert(id); 

    // Remove acknowledged otification from array
    for (var i = 0; i < this.pending_nonpersistent_array.length; i++) {
      if (this.pending_nonpersistent_array[i].id == id) {
        this.pending_nonpersistent_array.splice(i, 1);
      }
    }
    
    if (this.badgeCounter > 0) {
      this.badgeCounter = this.badgeCounter - 1;
      localStorage.setItem('badgeCounter', String(this.badgeCounter));
    }
  }

  notifyPopup(notifTitle: string, messageBody: string, data: string){
    var dataObj = JSON.parse(data);  

    let options = {
      type: "basic",
      body: messageBody,
      title: notifTitle,
      requireInteraction: true
    }
    this.playAudio(dataObj.schedTimeId, "../../assets/sounds/13798_sms_airport_sound.mp3");
    //this.playAudio(dataObj.schedTimeId, "../../assets/sounds/FAST.wav");

    this.pushNotifications.create("Sheldon", options).subscribe(
      res => {
         console.log(res);
         if (dataObj.schedTimeId){
            let schedTimeId = dataObj.schedTimeId;
            this.popupAlertMap.set(schedTimeId,res.notification);
            if (res.event.type == 'click'){
              this.acknowledgeNotif(schedTimeId);
            }
         } else if (dataObj.emitterString && dataObj.emitterString=="employeeundertime"){
           let id = dataObj.empName;
           this.popupAlertMap.set(id,res.notification);
           if (res.event.type == 'click'){
             this.acknowledgeNotif_nonpersistent(id);
             console.log("alert popup clicked.");
           }
        }
      },
      err => console.log(err)
    );
  }
  
  notifyPopupManager(notifTitle: string, messageBody: string, data: string){
    var dataObj = JSON.parse(data);  

    let options = {
      type: "basic",
      body: messageBody,
      title: notifTitle,
      requireInteraction: true
    }

    //this.playAudio(dataObj.schedTimeId, "../../assets/sounds/13798_sms_airport_sound.mp3");
    this.playAudio(dataObj.schedTime.schedTimeId, "../../assets/sounds/FAST.wav");

    this.pushNotifications.create("Sheldon", options).subscribe(
      res => {
         console.log(res);
         if (dataObj.schedTime.schedTimeId){
            let schedTimeId = dataObj.schedTime.schedTimeId;
            this.popupAlertMap.set(schedTimeId,res.notification);
            if (res.event.type == 'click'){
              this.acknowledgeNotifManager(schedTimeId);
            }
         }
      },
      err => console.log(err)
    );
  }

  getStatus(rowIndex) {
    return this.displayRows[rowIndex]['status'];
  }

  updateValue(event, cell, rowIndex) {
    //this.editing[rowIndex + '-' + cell] = false; // allow one click edit
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]); 

    var schedTime = new AckModel(this.rows[rowIndex]['schedTimeId'], this.rows[rowIndex][cell] );
    this.shift.updateReason(schedTime).pipe().subscribe(data =>{
        
        //refresh the shift notification time table
        //this.retrieveShiftNotif();
    });
  }
  
  acknowledgeNotifInGrid(cell, rowIndex) {
      var schedId = new AckModel(this.rows[rowIndex]['schedTimeId'], this.rows[rowIndex][cell] );
      this.removePopupAlert(this.rows[rowIndex]['schedTimeId']); 
      this.shift.confirmPending(schedId).pipe().subscribe(data =>{
          
          //refresh the shift notification time table
          this.retrieveShiftNotif();

                    if(this.currentUser.role.indexOf('roleCd=MANAGER')> -1){
                      this.retrieveDirectReports();
                    }
      
      if (this.badgeCounter > 0) {
        this.badgeCounter = this.badgeCounter - 1;
          localStorage.setItem('badgeCounter', String(this.badgeCounter));
        }
      });
  
  }

  createNewShift(){
    var confirmation = confirm("Do you want to create shift?");
    if(confirmation == true){
      this.router.navigate(['/newshift']);
    }
  }

  backShift(){
    this.shiftnotif.getShiftBackOrForward(this.selectedShiftSchedId, "-1" ,this.currentUser.userId).pipe().subscribe(data =>{
        this.displayRows = data.schedTimes;  

        this.selectedShiftSchedId = data.shiftSchedId;

        this.minShiftSchedId = data.firsAndLastShiftSchedIds[0]!=null?data.firsAndLastShiftSchedIds[0]:0;
        this.maxShiftSchedId = data.firsAndLastShiftSchedIds[1]!=null?data.firsAndLastShiftSchedIds[1]:0;
        
        //refresh the table rows
        this.displayRows = [...this.displayRows];
     }); 
  }

  goToCurrentShift(){
    this.selectedShiftSchedId = this.currentShiftSchedId;
    this.retrieveShiftNotif();
  }


  forwardShift(){
    if (this.selectedShiftSchedId != this.maxShiftSchedId){ 
      this.shiftnotif.getShiftBackOrForward(this.selectedShiftSchedId, "1" ,this.currentUser.userId).pipe().subscribe(data =>{
        this.displayRows = data.schedTimes;  

        this.selectedShiftSchedId = data.shiftSchedId;

        this.minShiftSchedId = data.firsAndLastShiftSchedIds[0]!=null?data.firsAndLastShiftSchedIds[0]:0;
        this.maxShiftSchedId = data.firsAndLastShiftSchedIds[1]!=null?data.firsAndLastShiftSchedIds[1]:0;
        
        //refresh the table rows
        this.displayRows = [...this.displayRows];
      }); 
    }
  }

  removePopupAlert(schedTimeId){
    if (this.popupAlertMap.has(schedTimeId)){
      let popupAlert = this.popupAlertMap.get(schedTimeId);
      popupAlert.close();
      this.popupAlertMap.delete(schedTimeId);
    }
    if (this.popupAlertSoundMap.has(schedTimeId)){
      let popupAlertSound = this.popupAlertSoundMap.get(schedTimeId);
      popupAlertSound.pause();
      popupAlertSound.currentTime = 0;
      popupAlertSound.src = "";
      this.popupAlertSoundMap.delete(schedTimeId);
    }
  }

  playAudio(schedTimeId, soundFile){
    let audio = new Audio();
    audio.src = soundFile;
    if (this.userPreferencesMap.get('ALERT_SOUND_ENABLE') == 'Y'){
      audio.volume = 0.2;
      audio.load();
      audio.play();
    }
  
    if (schedTimeId > 0){
      this.popupAlertSoundMap.set(schedTimeId,audio);
    }
  }

  setAlarmSound(alarmSoundEnable){
    this.userPreferencesMap.set('ALERT_SOUND_ENABLE', alarmSoundEnable);
    this.userpreferencesService.setUserPreference('ALERT_SOUND_ENABLE',alarmSoundEnable, this.currentUser.userId).pipe().subscribe(data =>{
        //save the user preferces alert sound ON/OFF to cookie
        for (var i = 0; i < this.currentUser.userOptions.length; i++) {
          if (this.currentUser.userOptions[i].optionCode == 'ALERT_SOUND_ENABLE'){
            this.currentUser.userOptions[i].optionValue = alarmSoundEnable;
          }
        } 
        this.cookieService.set('currentUser', JSON.stringify(this.currentUser));
    }); 
  }

  shiftNotif(): void {
    this.logger.debug("shiftNotifSource() - Start");
    this.sseService.setShiftNotifSource(`${constants.API_URL}/notification/shiftnotif/${this.currentUser.userId}`);
    this.sseService.getShiftNotifSource().addEventListener(this.currentUser.userId, message =>{
      var dataObj = JSON.parse(message.data);  
      this.playAudio(0, "../../assets/sounds/beep-02.mp3");
      this.logger.debugObject("shiftNotifSource() - triggered", dataObj.emitterString);
      if ('employeeundertime' == dataObj.emitterString) {
        this.logger.debugObject("employeeundertime() - triggered", dataObj.empName);
        let messageActual = "Hi " + this.currentUser.firstName + "! Your employee, " + dataObj.empName + ", is undertime!";
        this.notifyPopup("Something", messageActual, message.data);
        this.blinker.blink("New Notification", 20);
        
        this.pending_nonpersistent_array = []; 
        let pending_nonpersistent = {id: dataObj.empName, message: messageActual};
        this.pending_nonpersistent_array.push(pending_nonpersistent);
        this.badgeCounter = this.badgeCounter + 1;
        localStorage.setItem('badgeCounter', String(this.badgeCounter));
      }
      this.retrieveDirectReports();
    });
    this.logger.debug("shiftNotifSource() - End");
    
  }
  
  


  /* Clicking on row will open a popup dialog of employee notification table*/

  onActivate(event){
    if(event.type == 'click'){
      this.openEmployeeDialog(event.row);
    }
  }

  /* Function that opens Employee Dialog*/
  openEmployeeDialog(empInfo): void{
    
    /* Open dialog, then pass argument of function to dialog box*/
  
    let empDialog = this.dialog.open(EmployeeViewDialog, {
      width: '1000px',
      data: {name: empInfo.name, id: empInfo.userid, eid: empInfo.no},
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
  }

  onBreak(breakTimeDisable){
    this.userPreferencesMap.set('BREAK_TIME_DISABLE', breakTimeDisable);
    this.userpreferencesService.setUserPreference('BREAK_TIME_DISABLE',breakTimeDisable, this.currentUser.userId).pipe().subscribe(data =>{
        //save the user preferces break time to cookie
        for (var i = 0; i < this.currentUser.userOptions.length; i++) {
          if (this.currentUser.userOptions[i].optionCode == 'BREAK_TIME_DISABLE'){
            this.currentUser.userOptions[i].optionValue = breakTimeDisable;
          }
        } 
        this.cookieService.set('currentUser', JSON.stringify(this.currentUser));
    }); 

    var userId = new UserIdModel(this.currentUser.userId);
    if (breakTimeDisable == 'N'){
      this.shift.startBreak(this.currentUser.userId).pipe().subscribe(data =>{
        //refresh the shift notification time table
        this.retrieveShiftNotif();
      });
    } else {
      this.shift.endBreak(this.currentUser.userId).pipe().subscribe(data =>{
        //refresh the shift notification time table
        this.retrieveShiftNotif();
      });
    }
  }
  

} //------------------------


@Component({
  selector: 'miya-root-dashboard',
  templateUrl: './employee-popup.component.html'
})
export class EmployeeViewDialog{

  
  /* Array for table of employee notification */
  viewEmpRows= [];
  isPrevious = false;
  currentShiftSchedId = 0;
  selectedShiftSchedId = 0;
  minShiftSchedId = 0;
  maxShiftSchedId = 0;

  constructor(private empDialog: MatDialogRef<EmployeeViewDialog>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private readDashBoard: ShiftnotifService){
   
    this.retrieveShiftNotif();

  }


    /* refresh shiftNotif */
    refreshShiftNotif(){
      this.readDashBoard.getShiftNotif("-", this.data.id).pipe().subscribe(data =>{
        
        this.isPrevious = false;
        this.retrieveShiftNotif();
  
      });
  
      
    }
  
  
  /* retrieve read-only table of employee notification */
  retrieveShiftNotif(){
    this.readDashBoard.getShiftNotif("-", this.data.id).pipe().subscribe(data =>{

      this.viewEmpRows = data.schedTimes;

    
      this.currentShiftSchedId = data.shiftSchedId;
      if (this.selectedShiftSchedId == 0){
          this.selectedShiftSchedId = this.currentShiftSchedId;
      }

      this.minShiftSchedId = data.firsAndLastShiftSchedIds[0]!=null?data.firsAndLastShiftSchedIds[0]:0;
      this.maxShiftSchedId = data.firsAndLastShiftSchedIds[1]!=null?data.firsAndLastShiftSchedIds[1]:0;


      /* If no current shift */
      if(this.viewEmpRows == null){

        /* retrieve previous shift instead */
        this.retrieveShiftPrevious();
        this.isPrevious = true;

      }

    });
  }

  retrieveShiftPrevious(){
    this.readDashBoard.getShiftPrevious("-", this.data.id).pipe().subscribe(data =>{
      
     
      this.viewEmpRows = data.schedTimes;

      this.currentShiftSchedId = data.shiftSchedId;
      if (this.selectedShiftSchedId == 0){
          this.selectedShiftSchedId = this.currentShiftSchedId;
      }

   }); 
  }

  /* Clear viewEmpRows and close dialog*/
  closeDialog(){

    this.viewEmpRows = [];
  
    if(this.viewEmpRows.length == 0){
      console.log("Cleared");
    }
    this.empDialog.close();
    
  }

  backShift(){
    this.readDashBoard.getShiftBackOrForward(this.selectedShiftSchedId, "-1" ,this.data.id).pipe().subscribe(data =>{
        this.viewEmpRows = data.schedTimes;  

        this.selectedShiftSchedId = data.shiftSchedId;
        

        this.minShiftSchedId = data.firsAndLastShiftSchedIds[0]!=null?data.firsAndLastShiftSchedIds[0]:0;
        this.maxShiftSchedId = data.firsAndLastShiftSchedIds[1]!=null?data.firsAndLastShiftSchedIds[1]:0;
        
        //refresh the table rows
        this.viewEmpRows = [...this.viewEmpRows];
     }); 
     
  }

  forwardShift(){
    if (this.selectedShiftSchedId != this.maxShiftSchedId){ 
      this.readDashBoard.getShiftBackOrForward(this.selectedShiftSchedId, "1" ,this.data.id).pipe().subscribe(data =>{
        this.viewEmpRows = data.schedTimes;  

        this.selectedShiftSchedId = data.shiftSchedId;

        this.minShiftSchedId = data.firsAndLastShiftSchedIds[0]!=null?data.firsAndLastShiftSchedIds[0]:0;
        this.maxShiftSchedId = data.firsAndLastShiftSchedIds[1]!=null?data.firsAndLastShiftSchedIds[1]:0;
        
        //refresh the table rows
        this.viewEmpRows = [...this.viewEmpRows];
      }); 
    }
  }
}