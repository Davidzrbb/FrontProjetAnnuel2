export class Categorie {
  id: number | undefined;
  name: string;
  description: string;

  constructor(id: number | undefined, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
