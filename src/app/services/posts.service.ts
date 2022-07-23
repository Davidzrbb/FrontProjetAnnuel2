import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {UpdateAvaibality} from "../models/UpdateAvaibality";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private urlCreatePost = `${environment.apiUrl}/post/add`;
  private urlUpdatePost = `${environment.apiUrl}/post/updatePostUser`;
  private urlSearchPost = `${environment.apiUrl}/post/search-post`;
  private urlgetByiD = `${environment.apiUrl}/post/get`;
  private urlgetByAll = `${environment.apiUrl}/post/all`;
  private urlgetByUserId = `${environment.apiUrl}/post/getByUserId`;
  private urlgetByPost = `${environment.apiUrl}/activityZone/getByIdPost`;


  constructor(private http: HttpClient) {
  }


  createPosts(postsSave: { codeDep: string[]; cityCode: number | null; hourlyWage: number; description: string; numberChild: number | null; availability: string[][] | null, ageChild: null , listSkill: string[] | null}) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post<boolean>(this.urlCreatePost, postsSave, header);
  }

  searchPost(search: { activityZone: string[]; skill: string[]; availability: string[]; category: string[] }) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post<any>(this.urlSearchPost, search, header);
  }

  getPostById(idPost: number) {
    //get
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlgetByiD + "/" + idPost, header);
  }

  getActivityZoneByPost(id: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlgetByPost + "/" + id, header);

  }

  getAllPost() {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlgetByAll, header);
  }

  getPostByIdUser(idUser: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlgetByUserId + "/" + idUser, header);
  }


  updatePost(post: { idUser: number; hourlyWage: string; description: string; idPost: number }) {
    const intituleDiplome = post.description.replace("'", " ");
    post.description = intituleDiplome;
    post.hourlyWage = String(parseInt(post.hourlyWage));
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post<any>(this.urlUpdatePost, post, header);
  }
}
