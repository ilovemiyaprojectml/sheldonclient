import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SysCode} from '../_models/syscode';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

import { constants } from '../core/constants';

@Injectable()
export class DataServiceConfig {
  private readonly API_URL = `${constants.API_URL}`;

  dataChange: BehaviorSubject<SysCode[]> = new BehaviorSubject<SysCode[]>([]);
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  get data(): SysCode[] {
    return this.dataChange.value;
  }
  
  getDialogData() {
    return this.dialogData;
  }
  
  getAllSysCodes(): void {
    this.httpClient.get<SysCode[]>(this.API_URL + '/getallsyscodes', {params: {withAll: '0'}}).subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }


  addSysCodeDefault (usera: SysCode): void {
    this.dialogData = usera;
  }
  
  addSysCode (usera: SysCode): void {
    this.httpClient.post(this.API_URL + '/addsyscode', usera).subscribe((data:any) => {
		if (data.msg == 'Add System Code Successful!') {
			usera.code_id = data.data
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
		alert('Add System Code Failed!'); 
		//location.reload();
      }
    );
  }

  updateSysCodeDefault (usera: SysCode): void {
    this.dialogData = usera;
  }
  
  updateSysCode (usera: SysCode): void {
    this.httpClient.post(this.API_URL + '/editsyscode', usera).subscribe((data:any) => {
		if (data.msg == 'Edit System Code Successful!') {
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
		alert('Edit System Code Failed!'); 
		//location.reload();
      }
    );
  }

  deleteSysCodeDefault (id: number): void {
    console.log(id);
  }
  
  deleteSysCode (usera: SysCode): void {
    this.httpClient.post(this.API_URL + '/deletesyscode', usera).subscribe((data:any) => {
		if (data.msg == 'Delete System Code Successful!') {
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
		alert('Delete System Code Failed!'); 
		//location.reload();
      }
    );
  }
}





