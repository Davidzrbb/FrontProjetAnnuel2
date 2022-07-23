export class PostParent {
  id: number | undefined;
  idUser: number;
  city: string;
  hourlyWage: number;
  description: string;
  ageChild: string;
  numberChild: number;

  constructor(id: number | undefined, idUser: number, city: string, hourlyWage: number, description: string, ageChild: string, numberChild: number) {
    this.id = id;
    this.idUser = idUser;
    this.city = city;
    this.hourlyWage = hourlyWage;
    this.description = description;
    this.ageChild = ageChild;
    this.numberChild = numberChild;
  }
}
