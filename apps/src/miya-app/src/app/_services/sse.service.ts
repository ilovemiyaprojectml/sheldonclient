import {Injectable} from '@angular/core';

@Injectable()
export class SseService {

  /*Event Sources*/
  connectSource: any;
  missNotifSource: any;
  shiftNotifSource: any;


  getConnectSource() {
    return this.connectSource;
  }
  
  closeConnectSource() {
	  if (this.connectSource) {
      this.connectSource.close();
    }
    
  }
  
  getMissNotifSource() {
    return this.missNotifSource;
  }
  
  closeMissNotifSource() {
	  if (this.missNotifSource) {
      this.missNotifSource.close();
    }
    
  }
  
  setConnectSource(url : string) {
    this.connectSource = new EventSource(url);
  }
  
  setMissNotifSource(url : string) {
    this.missNotifSource = new EventSource(url);
  }
  
  getShiftNotifSource() {
    return this.shiftNotifSource;
  }
  
  closeShiftNotifSource() {
    if (this.shiftNotifSource) {
      this.shiftNotifSource.close();
    }
    
  }
  
  setShiftNotifSource(url : string) {
    this.shiftNotifSource = new EventSource(url);
  }
  
  
}

