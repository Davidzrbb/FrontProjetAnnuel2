import {Injectable} from '@angular/core';
import {UserConnect} from "../models/UserConnect";
import {environment} from 'src/environments/environment';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {ResponseUser} from "../models/ResponseUser";

@Injectable({
  providedIn: 'root'
})
export class ConnexionService {

  private urlConnection = `${environment.apiUrl}/auth/login`;
  private urlConnectionQrCode = `${environment.apiUrl}/auth/loginQrCode`;
  private urlisUserLoggedIn = `${environment.apiUrl}/auth/me`;
  private urlRole = `${environment.apiUrl}/auth/getRoleByUserId`;
  private urlUserByLogin = `${environment.apiUrl}/auth/getUserLogin`;
  private urlFistConnexion = `${environment.apiUrl}/auth/getFirstConnexion`;
  private urlAllUser = `${environment.apiUrl}/auth/getAllUsers`;
  private urlGetById = `${environment.apiUrl}/auth/getUserById`;
  private urlGetUserNonBanned = `${environment.apiUrl}/auth/getUserNonBanned`;

  constructor(private http: HttpClient) {
  }

  connectUser(userConnect: UserConnect): Observable<ResponseUser> {
    return this.http.post<ResponseUser>(this.urlConnection, userConnect);
  }

  connectUserQrCode(userConnect: UserConnect): Observable<any> {
    return this.http.post<any>(this.urlConnectionQrCode, userConnect);
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  async getRoleByToken(id_user: number): Promise<HttpEvent<any> | null> {
    try {
      return await this.getRole(id_user);
    } catch (e) {
      return null;
    }
  }

  async isUserLoggedIn(): Promise<HttpEvent<any> | null> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    try {
      return await this.getUserData(header);
    } catch (e) {
      return null;
    }
  }

  async getUserByLogin(login: string): Promise<HttpEvent<any> | null> {
    try {
      return await this.getUser(login);
    } catch (e) {
      return null;
    }
  }

  async getUser(login: any) {
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      this.http.get<HttpEvent<string>>(this.urlUserByLogin + "/" + login).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }

  async getRole(id_user: number) {
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      this.http.get<HttpEvent<string>>(this.urlRole + "/" + id_user).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }

  async getUserData(header: any) {
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      this.http.get<HttpEvent<string>>(this.urlisUserLoggedIn, header).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }


  async getFirstConnexion() {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    try {
      return await this.getBoolFirstConnexion(header);
    } catch (e) {
      return null;
    }
  }

  async getBoolFirstConnexion(header: any) {
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      this.http.get<HttpEvent<string>>(this.urlFistConnexion, header).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }

  getAllUsers() {
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      this.http.get<HttpEvent<string>>(this.urlAllUser).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }

  getAllUsersNonBanned() {
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      this.http.get<HttpEvent<string>>(this.urlAllUser).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }

  getSkills(login: string) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      this.http.get<HttpEvent<string>>(`${environment.apiUrl}/categorie/getSkillsByUserLogin/${login}`, header).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }

  getSkillsByUserId(id: string) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return new Promise<HttpEvent<any>>((resolve, reject) => {
        this.http.get<HttpEvent<string>>(`${environment.apiUrl}/categorie/getSkillsByPost/${id}`, header).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }

  getUserById(id: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      this.http.get<HttpEvent<any>>(this.urlGetById + "/" + id, header).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });

  }
}
