
// Model class for existing shift schedule 



export class ShiftSchedule {

    shftSchedId: string;
    schedStartDate: string;
    schedEndDate: string;
    actualEndDate: string;
    dateCreated: string;
    dateLastUpdated: string;
    createdBy: string;
    lastUpdatedBy: string;
    isActive: string;
    isShiftEnded: string;

    constructor(
        shftSchedId: string,
        schedStartDate: string,
        schedEndDate: string,
        actualEndDate: string,
        dateCreated: string,
        dateLastUpdated: string,
        createdBy: string,
        lastUpdatedBy: string,
        isActive: string,
        isShiftEnded: string
    ){

      this.schedStartDate = schedStartDate;
      this.schedEndDate = schedEndDate;
      this.actualEndDate = actualEndDate;
      this.dateCreated = dateCreated;
      this.dateLastUpdated = dateLastUpdated;
      this.createdBy = createdBy;
      this.lastUpdatedBy = lastUpdatedBy;
      this.isActive = isActive;
      this.isShiftEnded = isShiftEnded;

    }


} 
