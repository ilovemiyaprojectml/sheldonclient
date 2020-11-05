import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { constants } from '../core/constants';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class ShiftnotifService { 

  constructor(private http: HttpClient, private router: Router) { }


  getShiftNotif(notifDate, userId){
    return this.http.get<any>(`${constants.API_URL}/shift-notif/${notifDate}/${userId}`)
    .pipe(map(resp =>{
      if(resp){
        console.log(resp);
      }
      return resp;
    }));
  }
  
  getShiftPrevious(notifDate, userId){
    return this.http.get<any>(`${constants.API_URL}/shift-prev/${notifDate}/${userId}`)
    .pipe(map(resp =>{
      if(resp){
        console.log(resp);
      }
      return resp;
    }));
  }

  getShiftBackOrForward(selectedShiftSchedId, direction, userId){
    return this.http.get<any>(`${constants.API_URL}/shift/${selectedShiftSchedId}/${direction}/${userId}`)
    .pipe(map(resp =>{
      if(resp){
        console.log(resp);
      }
      return resp;
    }));
  }

}
