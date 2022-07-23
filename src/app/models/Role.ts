export class Role {
  id: number | undefined;
  role: string;

  constructor(id: number | undefined, role: string){
    this.id = id;
    this.role = role;
  }
}
