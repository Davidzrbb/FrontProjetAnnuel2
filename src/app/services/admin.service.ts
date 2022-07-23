import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Signalement} from "../models/Signalement";
import {UserSubscribe} from "../models/UserSubscribe";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private urlAdminIsLogin = `${environment.apiUrl}/admin`;
  private urlSignalement = `${environment.apiUrl}/admin/signalements`;
  private urlGetUSerById = `${environment.apiUrl}/admin/users`;
  private urlGetSignalementByIdProfile = `${environment.apiUrl}/admin/signalements/profile`;
  private urlGetAllUsers = `${environment.apiUrl}/admin/users`;
  private urlBanUser = `${environment.apiUrl}/admin/users/banUser`;
  private urlUnBanUser = `${environment.apiUrl}/admin/users/unBanUser`;

  constructor(private http: HttpClient) {
  }

  isUserLogin(){
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<boolean>(this.urlAdminIsLogin + "/", header);
  }

  getSignalements(){
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<Signalement[]>(this.urlSignalement, header);
  }

  getUserById(id: number){
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    console.log(this.urlGetUSerById + "/" + id);
    return this.http.get<UserSubscribe>(this.urlGetUSerById + "/" + id, header);
  }

  getUserBanById(id: number){
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    console.log(this.urlGetUSerById + "/" + id);
    return this.http.get<User>(this.urlGetUSerById + "/" + id, header);
  }

  getSignalementByIdProfile(id: number){
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<Signalement[]>(this.urlGetSignalementByIdProfile + "/" + id, header);
  }

  getUsers(){
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<User[]>(this.urlGetAllUsers, header);
  }

  banUser(id: number) {
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    let body = {
      id: id
    }
    return this.http.put<User>(this.urlBanUser, body, header);
  }

  unBanUser(id: number) {
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    let body = {
      id: id
    }
    return this.http.put<User>(this.urlUnBanUser, body, header);
  }

}
