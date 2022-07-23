import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

export class Contract {
  id: number | undefined;
  idParent: number;
  idBabysitter: number;
  validateAt: Date | null;
  numberOfHours: number;
  hourlyWage: number;
  qrCode: string | undefined;
  numberOfSitting: number;
  numberOfHourDone: number;
  startDate: Date | null;
  endDate: Date | null;
  step: number = 0;


  constructor(id: number | undefined, idParent: number, idBabysitter: number, validateAt: Date | null, numberOfHours: number, hourlyWage: number, qrCode: string | undefined, numberOfSitting: number, numberOfHourDone: number, startDate: Date | null, endDate: Date | null, step: number) {
    this.id = id;
    this.idParent = idParent;
    this.idBabysitter = idBabysitter;
    this.validateAt = validateAt;
    this.numberOfHours = numberOfHours;
    this.hourlyWage = hourlyWage;
    this.qrCode = qrCode;
    this.numberOfSitting = numberOfSitting;
    this.numberOfHourDone = numberOfHourDone;
    this.startDate = startDate;
    this.endDate = endDate;
    this.step = step;
  }
}
