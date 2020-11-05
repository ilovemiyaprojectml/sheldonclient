
// Model class for adding a new shift 



export class NewShift {

    shiftStartDate: string;
    shiftStartTime: string;
    shiftEndDate: string;
    shiftEndTime: string;
    allowedBreaks: number;

    constructor(startDate: string, startTime: string, endDate: string, endTime: string, allowedBreaks: number){

        this.shiftStartDate = startDate;
        this.shiftStartTime = startTime;
        this.shiftEndDate = endDate;
        this.shiftEndTime = endTime;
        this.allowedBreaks = allowedBreaks;

    }


}
