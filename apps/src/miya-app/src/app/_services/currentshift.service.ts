import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { constants } from '../core/constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrentshiftService {

  constructor(private http: HttpClient, private router: Router) { }

  checkCurrentShift(userId){
    return this.http.get<any>(`${constants.API_URL}/getshiftsched/user/${userId}`)
    .pipe(map(resp => {
      if(resp){
        console.log(resp);
      }
      return resp;
    }));
    
  }


}
