import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { constants } from '../core/constants';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class RootDashboardService { 

  constructor(private http: HttpClient, private router: Router) { }


  getDirectReportsShiftsToday(userId){
    return this.http.get<any>(`${constants.API_URL}/manager/drshifttoday/${userId}`)
    .pipe(map(resp =>{
      if(resp){
        console.log(resp);
      }
      return resp;
    }));
  }

}
