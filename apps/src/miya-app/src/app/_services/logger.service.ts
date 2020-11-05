
/*
    logger.service.ts
    logger service
    
    console.log will show in Chrome Developer Tools Console Screen
    
    make sure to run the following commands to enable logger on 
    Command Prompt (Run as Amdnistrator)
    npm install @types/node --save-dev

*/


import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {  
  
  debug(msg: any) {
    console.log(new Date() + ": "
      + JSON.stringify(msg));
    
  }
  
  debugObject(msg: any, object: any) {
    console.log(new Date() + ": "
        + JSON.stringify(msg));
    console.log(object);
    
  }

}