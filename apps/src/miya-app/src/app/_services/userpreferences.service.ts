import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { constants } from '../core/constants';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class UserpreferencesService { 

  constructor(private http: HttpClient) { }

  setUserPreference(optionCode, optionValue, userId){
    return this.http.get<any>(`${constants.API_URL}/user-options/${optionCode}/${optionValue}/${userId}`)
      .pipe(map(resp =>{
        if(resp){
          console.log(resp);
        }
        return resp;
      }));
  }
  
}
