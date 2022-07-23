import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Contract} from "../models/Contract";

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private urlCreateContract = `${environment.apiUrl}/contract/create`;
  private urlGetByParent = `${environment.apiUrl}/contract/getByParent`;
  private urlGetByBabysitter = `${environment.apiUrl}/contract/getByBabysitter`;
  private urlGetById = `${environment.apiUrl}/contract/getById`;
  private urlGetStripe = `${environment.apiUrl}/contract/stripe`;
  private urlUpdateContractStep = `${environment.apiUrl}/contract/updateContractStep`;
  private urlUpdateHoursDone = `${environment.apiUrl}/contract/updateHoursDone`;

  constructor(private http: HttpClient) {
  }

  insertContract(contract: Contract): Observable<boolean> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post<boolean>(this.urlCreateContract, contract, header);
  }


  getAllContractsByParent(userIdByToken: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<boolean>(this.urlGetByParent + "/" + userIdByToken, header);
  }

  getAllContractsByBabysitter(userIdByToken: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<boolean>(this.urlGetByBabysitter + "/" + userIdByToken, header);
  }

  getById(idContract: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      return this.http.get<any>(this.urlGetById + "/" + idContract, header).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }

  stripe(stripeToken: any):Observable<any> {
    console.log(stripeToken);
    return this.http.post<boolean>(this.urlGetStripe, stripeToken);
  }

  updateStepValidate(id: number, step: number) {
    let idObj = {id: id, step: step};
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      return this.http.put<any>(this.urlUpdateContractStep, idObj, header).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }

  updateHours(id: number, hours: number) {
    let idObj = {id: id, hours: hours};
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return new Promise<HttpEvent<any>>((resolve, reject) => {
      return this.http.put<any>(this.urlUpdateHoursDone, idObj, header).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error)
      });
    });
  }
}
