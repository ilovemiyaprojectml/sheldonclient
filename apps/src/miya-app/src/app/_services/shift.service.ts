
/*

  shift.service.ts
  A service that handles creating new shift and updating a current shift.

*/




import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';



import { constants } from '../core/constants';
import { NewShift } from '../_models/newshift.model';
import { CookieService } from 'ngx-cookie-service';
import { ShiftSchedule } from '../_models/shiftschedule.model';
import { UserIdModel } from '../_models/userid.model';
import { AckModel } from '../_models/ack.model';
import { LoggerService } from '../_services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  shiftSchedule: ShiftSchedule;
  
  constructor(
      private http: HttpClient, 
      private cookieService: CookieService, 
      private logger: LoggerService) { }



  /* newshift(shift: NewShift, userid: number)

    A function that handles creating new shift and send a request to server then returns
    current shift information (start date, start time, etc.)

    @params shift: NewShift - a JSON object for shift information
    @params userid: number - a number which represents the user who request a new shift

  */
  newshift(shift: NewShift, userid: number){


    // initiate a POST request to server, with shift object as a request body
    return this.http.post<any>(`${constants.API_URL}/shiftSchedules/user/${userid}`,shift)
    .pipe(map(shift=>{

        // check if shift has a value
        if(shift){
          
          // save that shift on a cookie
          this.cookieService.set('currentShift', JSON.stringify(shift));

        }
        return shift; 

    }));
  }


  endShift(userId: UserIdModel){
     
    return this.http.post<any>(`${constants.API_URL}/end-shift`, userId)
    .pipe(map(res =>{


      if(res){
        //something you can do with response
      }

      return res;
    }));
  }

  checkCurrentShift(userId){
    return this.http.get<any>(`${constants.API_URL}/getcurrent/${userId}`)
    .pipe(map(shiftSchedule =>{

      if(shiftSchedule){
        console.log("checkCurrentShift() response: ");
        console.log(shiftSchedule);
      }

      return shiftSchedule;
    }));
  }

  getAllDateOfShift(userId){
    return this.http.get<any>(`${constants.API_URL}/alldate/${userId}`)
    .pipe(map(res =>{

      if(res){
          //do something
      }


      return res;
    }));
  }



  getAllPending(userId){
      return this.http.get<any>(`${constants.API_URL}/shift-notif/pending/${userId}`)
      .pipe(map(res =>{
          if(res){
            //do something
          }

          return res;
      }));
  }
  
  getAllPendingManager(userId){
	  console.log("emmantest-getAllPendingManager");
      return this.http.get<any>(`${constants.API_URL}/shift-notif/pendingManager/${userId}`)
      .pipe(map(res =>{
          if(res){
            //do something
          }

          return res;
      }));
  }
  
  

  confirmPending(schedTimeId: AckModel){
    return this.http.post<any>(`${constants.API_URL}/notification/ack`, schedTimeId)
    .pipe(map(res =>{
      if(res){
        //do something
      }
      return res;
    }));
  }
  
  confirmPendingManager(schedTimeId: AckModel){
    return this.http.post<any>(`${constants.API_URL}/notification/ackManager`, schedTimeId)
    .pipe(map(res =>{
      if(res){
        //do something
      }
      return res;
    }));
  }

  
  
  updateReason(schedTime: AckModel){
    return this.http.post<any>(`${constants.API_URL}/shiftSchedTime/reason`, schedTime)
    .pipe(map(res =>{
      if(res){
        //do something
      }
      return res;
    }));
  }
  

  
  validateShift(shift: NewShift, userid: number){
    this.logger.debug("validateShift() - Start");

    // initiate a POST request to server, with shift object as a request body
    return this.http.post<any>(`${constants.API_URL}/validateShift/user/${userid}`, shift)
    .pipe(map(shift=>{

        // check if shift has a value
        if(shift){
          
          // save that shift on a cookie
          this.cookieService.set('validateShift', JSON.stringify(shift));

        }
        
        this.logger.debug("validateShift() - End");
        return shift;

    }));
  }

  getSysAllowedBreaks(){ 
    return this.http.get<any>(`${constants.API_URL}/getAllowedBreakTime`)
      .pipe(map(allowedBreakTimes =>{
        if(allowedBreakTimes){
          // save that allowedBreakTimes on a cookie
          this.cookieService.set('allowedBreakTimes', JSON.stringify(allowedBreakTimes));
        }
        return allowedBreakTimes;
    }));
  }

  startBreak(userId: UserIdModel){
    console.log("im on break!");
    return this.http.post<any>(`${constants.API_URL}/start-break`, userId)
    .pipe(map(res =>{
      if(res){
        console.log("break time STARTED...userId="+userId);
        //something you can do with response
      }

      return res;
    }));
  }

  endBreak(userId: UserIdModel){
    console.log("break time is over!");
    return this.http.post<any>(`${constants.API_URL}/end-break`, userId)
    .pipe(map(res =>{
      if(res){
        console.log("break time ENDED. userId="+userId);
        //something you can do with response
      }

      return res;
    }));
  }

  
}
