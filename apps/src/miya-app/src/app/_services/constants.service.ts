
/*
    constants.service.ts 
    All utility constants to be used for the entire application will be declared here
    All utility constant names must be uppercase

*/


import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {
  readonly DATE_FORMAT_DISPLAY: string = "MM/dd/yyyy";
  readonly DATE_FORMAT_DATABASE: string = "yyyy-MM-dd";
  
  constructor() { }

}