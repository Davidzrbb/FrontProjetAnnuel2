export class Signalement {
  id: number | undefined;
  idProfile: number;
  idSignaler: number;
  dateTime: string;
  reason: string;

  constructor(id: number | undefined, idProfile: number, idSignaler: number, dateTime: string, reason: string){
    this.id = id;
    this.idProfile = idProfile;
    this.idSignaler = idSignaler;
    this.dateTime = dateTime;
    this.reason = reason;
  }
}
