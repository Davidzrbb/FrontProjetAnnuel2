export class UserConnectQRCode {
  login: string;
  password : string;
  idBabysitter: number;
  idContract: number;

  constructor(login: string, password: string, idBabysitter: number, idContract: number) {
    this.login = login;
    this.password = password;
    this.idBabysitter = idBabysitter;
    this.idContract = idContract;
  }
}
