
/* api.service.ts

    A service that handles API URL from a server


*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { constants } from './core/constants';



@Injectable({
    providedIn: 'root'
})

export class ApiService{
    API_URL = "http://localhost:8081/api"; 

    constructor(private httpClient: HttpClient){ 
    
    }

    
}