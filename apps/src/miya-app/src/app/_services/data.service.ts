import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserA} from '../_models/usera';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

import { constants } from '../core/constants';

@Injectable()
export class DataService {
  private readonly API_URL = `${constants.API_URL}`;

  dataChange: BehaviorSubject<UserA[]> = new BehaviorSubject<UserA[]>([]);
  dataManager: BehaviorSubject<UserA[]> = new BehaviorSubject<UserA[]>([]);
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  get data(): UserA[] {
    return this.dataChange.value;
  }
  
  get dataM(): UserA[] {
    return this.dataManager.value;
  }

  getDialogData() {
    return this.dialogData;
  }
  
  getAllManagers(): void {
	
    this.httpClient.get<UserA[]>(this.API_URL + '/getallmanagers', {params: {withAll: '0'}}).subscribe(data => {
        this.dataManager.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }


  getAllUsers(): void {
    this.httpClient.get<UserA[]>(this.API_URL + '/getallusers', {params: {withAll: '0'}}).subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }


  addUserDefault (usera: UserA): void {
    this.dialogData = usera;
  }
  
  addUser (usera: UserA): void {
    this.httpClient.post(this.API_URL + '/adduser', usera).subscribe((data:any) => {
		if (data.msg == 'Add User Successful!') {
			usera.user_id = data.data
			this.dialogData = usera;
			alert(data.msg);
			 //setTimeout(() => {
				//location.reload();
				//alert(data.msg);
			  //}, 1500);
		} else {
			alert(data.msg); 
			//location.reload();
		}
      },
      (err: HttpErrorResponse) => {
		this.dialogData = usera;
		alert('Add User Failed!'); 
		//location.reload();
      }
    );
  }

  updateUserDefault (usera: UserA): void {
    this.dialogData = usera;
  }
  
  updateUser (usera: UserA): void {
    this.httpClient.post(this.API_URL + '/edituser', usera).subscribe((data:any) => {
		if (data.msg == 'Edit User Successful!') {
			this.dialogData = usera;
			alert(data.msg);
			 //setTimeout(() => {
				//location.reload();
				//alert(data.msg);
			  //}, 1500);
		} else {
			alert(data.msg); 
			//location.reload();
		}
      },
      (err: HttpErrorResponse) => {
		this.dialogData = usera;
		alert('Edit User Failed!'); 
		//location.reload();
      }
    );
  }

  deleteUserDefault (id: number): void {
    console.log(id);
  }
  
  deleteUser (usera: UserA): void {
    this.httpClient.post(this.API_URL + '/deleteuser', usera).subscribe((data:any) => {
		if (data.msg == 'Delete User Successful!') {
			alert(data.msg);
			 //setTimeout(() => {
				//location.reload();
				//alert(data.msg);
			  //}, 1500);
		} else {
			alert(data.msg); 
			//location.reload();
		}
      },
      (err: HttpErrorResponse) => {
		alert('Delete User Failed!'); 
		//location.reload();
      }
    );
  }
}




