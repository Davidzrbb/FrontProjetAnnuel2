import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {ResponseUser} from "../models/ResponseUser";
import {UserSubscribe} from "../models/UserSubscribe";
import {UpdateBabysitter} from "../models/UpdateBabysitter";


@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  private urlSubscribe = `${environment.apiUrl}/auth/subscribe`;
  private urlUpdateBabysitter = `${environment.apiUrl}/auth/updateBabysitter`;
  private urlUpdateSkillsBabysitter = `${environment.apiUrl}/auth/updateSkillsBabysitter`;
  private urlDelteSkillsBabysitter = `${environment.apiUrl}/auth/deleteSkillsBabysitter`;
  private urlUpdateUser = `${environment.apiUrl}/auth/updateUser`;
  private urlGetAllCategories = `${environment.apiUrl}/categorie/getAllCategories`;

  constructor(private http: HttpClient) {
  }

  subscribeUser(user: UserSubscribe): Observable<ResponseUser> {
    return this.http.post<ResponseUser>(this.urlSubscribe, user);
  }

  insertBabysitter(updateBabysitter: UpdateBabysitter): Observable<boolean> {
    return this.http.post<boolean>(this.urlUpdateBabysitter, updateBabysitter);
  }

  updateSkillsBabysitter(updateBabysitter: UpdateBabysitter): Observable<boolean> {
    return this.http.post<boolean>(this.urlUpdateSkillsBabysitter, updateBabysitter);
  }



  updateUser(updateUser: UserSubscribe): Observable<boolean> {
    return this.http.post<boolean>(this.urlUpdateUser, updateUser);
  }

  initCategories(): Observable<any> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlGetAllCategories,header);
  }

  deleteSkill(id: number) {
    return this.http.delete(this.urlDelteSkillsBabysitter + "/" + id);
  }


}

