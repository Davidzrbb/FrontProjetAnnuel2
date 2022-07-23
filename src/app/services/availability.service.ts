import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {UpdateAvaibality} from "../models/UpdateAvaibality";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private urlAvailabilityParse = `${environment.apiUrl}/availability/getAvailabilityParseByUserId`;
  private urlAvailabilityById = `${environment.apiUrl}/availability/getByUser`;
  private urlAvailabilityByPostId = `${environment.apiUrl}/availability/getByPost`;
  private urlUpdateAvailabilityBabysitter = `${environment.apiUrl}/availability/create`;
  private insertAvailabilityBabysitter = `${environment.apiUrl}/availability/create`;
  private urlDelete = `${environment.apiUrl}/availability/delete`;
  private urlComment = `${environment.apiUrl}/comment/create`;
  private urlCreateCertified = `${environment.apiUrl}/categorie/certifySkill`;

  constructor(private http: HttpClient) {
  }

  getAvailabilityParseByUserId(idUser: string): Observable<any> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlAvailabilityParse + "/" + idUser, header);
  }

  //getByUserId
  getByUserId(idUser: number): Observable<any> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlAvailabilityById + "/" + idUser, header);
  }

  getByPostId(idPost: number): Observable<any> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlAvailabilityByPostId + "/" + idPost, header);
  }

  updateAvailabilityBabysitter(updateAvailability: UpdateAvaibality): Observable<boolean> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post<boolean>(this.urlUpdateAvailabilityBabysitter, updateAvailability, header);
  }

  insertAvailability(avaibality: {}): Observable<boolean> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post<boolean>(this.insertAvailabilityBabysitter, avaibality, header);
  }

  deleteAvaibality(id: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.delete(this.urlDelete + "/" + id, header);
  }


  insertComment(comment: { idProfile: number; date: Date; note: number; content: string }) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post(this.urlComment, comment, header);
  }

  getAllComments(userId: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get(`${environment.apiUrl}/comment/getByProfile/${userId}`, header);
  }

  createSignalement(signalement: { idProfile: number; dateTime: Date; reason: string; idSignaler: number }) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post(`${environment.apiUrl}/signalement/create`, signalement, header);
  }

  createCertified(certified: { idDiplome: string; userName: string }, skillId: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post<any>(this.urlCreateCertified+ "/"+ skillId, certified, header);
  }
}
