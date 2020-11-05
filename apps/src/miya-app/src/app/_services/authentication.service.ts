
/*

  authentication.service.ts
  A service that handles authentication such as login and logout

*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { constants } from '../core/constants';


import { CookieService } from 'ngx-cookie-service';
import { User } from '../_models';
import { UserCredentials } from '../_models';
import { Router } from '@angular/router';


@Injectable()
export class AuthenticationService {

	userCredentials: UserCredentials;

  constructor(private http: HttpClient, private cookieService: CookieService,
    private router: Router) { }
  
  // a function that handles login (send a request to server) then returns user credentials
  // It will become JWT compliant in the near future
  // @params user: User - A JSON object for user credentials such as username and password  

  login(user: User){
  
    //alert(user.username);
    //alert(user.password);
    //alert(user.email);
    
    //initiate a POST request to server with user object as a request body
    return this.http.post<any>(`${constants.API_URL}/users/authenticate`, user
   ).pipe(map(userCredentials => {

     //alert(JSON.stringify(userCredentials));
     this.cookieService.set('currentUser', JSON.stringify(userCredentials));
      return user;
    }));
  }


  logout(){
    this.cookieService.delete('currentUser');
    this.router.navigate(['/login']);
  }

}






  



