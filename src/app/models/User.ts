export class User {
  id : number;
  login: string;
  password: string;
  lastname: string;
  name: string;
  id_role: number;
  age: number | null;
  sexe: number;
  email: string;
  photo: string | undefined;
  description: string | undefined;
  banned: boolean;
}
