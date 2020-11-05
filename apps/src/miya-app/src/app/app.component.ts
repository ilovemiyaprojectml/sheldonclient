
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PushNotificationsModule, PushNotificationsService } from 'ng-push';
import { constants } from './core/constants';
import { CookieService } from 'ngx-cookie-service';

import {SseService} from './_services/sse.service';
import { LoggerService } from './_services';


export interface DialogData{
  content: string;
}





@Component({
  selector: 'miya-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Work from Home';
  
  constructor(private cookieService: CookieService, public sseService: SseService, private logger: LoggerService){
	
  }
  
   ngOnDestroy() {
    this.logger.debug("ngOnDestroy() - Start");
    this.sseService.closeConnectSource();
	  this.sseService.closeMissNotifSource();
	  this.sseService.closeShiftNotifSource();
    this.logger.debug("ngOnDestroy() - End");
  }
  
  
  
  /*
  constructor(private pushNotifications: PushNotificationsService){
      this.pushNotifications.requestPermission();
     
  }
*/

/*

  notify(){
    let options = {
      body: "Hey I'm a Notification!"
    }
    this.pushNotifications.create("Test", options).subscribe(
      res => {console.log(res)
      
        if(res.event.type == 'click'){
          alert("You clicked me. Thats good!");
          
        }
        //setTimeout(() => {res.notification.close()}, 1000);
      },
      err => console.log(err)
    );
  }

*/



}


