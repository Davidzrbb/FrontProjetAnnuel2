export class UpdateBabysitter {
  id: number;
  arraySkill: [{ category: string; skill: string }];
  description: string | undefined;
  photo: string | ArrayBuffer | null;
}
