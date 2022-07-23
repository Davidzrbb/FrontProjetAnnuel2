export class PostBabysitter {
  id: number | undefined;
  idUser: number;
  city: string;
  activityZone: string;
  hourlyWage: number;
  description: string;

  constructor(id: number | undefined, idUser: number, city: string, activityZone: string, hourlyWage: number, description: string) {
    this.id = id;
    this.idUser = idUser;
    this.city = city;
    this.activityZone = activityZone;
    this.hourlyWage = hourlyWage;
    this.description = description;
  }
}
