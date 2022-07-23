import { Component, OnInit } from '@angular/core';
import {AdminService} from "../services/admin.service";
import {Signalement} from "../models/Signalement";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {UserSubscribe} from "../models/UserSubscribe";

@Component({
  selector: 'app-admin-signalement',
  templateUrl: './admin-signalement.component.html',
  styleUrls: ['./admin-signalement.component.scss']
})
export class AdminSignalementComponent implements OnInit {


  public haveSignalements: boolean = false;
  public allSignalements: Signalement[] = [];
  public signalements: Signalement[] = [];
  public photos: string[] = [];
  public names: string[] = [];
  public numberSignalements: number[] = [];

  constructor(private adminService: AdminService, private router: Router) { }

  async ngOnInit(){
    await this.initUserAdmin().then(async () => {
      await this.getSignalements();
    });
  }

  async initUserAdmin(){
    await this.adminService.isUserLogin().subscribe(
      (data: any) => {
      }, (error: any) => {
        console.log("Vous n'êtes pas admin");
        this.router.navigate(['/home']);
      }
    );
  }

  async getSignalements() {
    await this.adminService.getSignalements().subscribe(
      async (data: Signalement[]) => {
        if (data["response"].length > 0) {
          this.allSignalements = data["response"];
          for(let signalement of this.allSignalements){
            await this.getPhotoUserById(signalement.idProfile);
            if (this.numberSignalements[signalement.idProfile] == undefined){
              this.numberSignalements[signalement.idProfile] = 0;

            }
            this.numberSignalements[signalement.idProfile] = this.numberSignalements[signalement.idProfile] + 1;

            if (this.numberSignalements[signalement.idProfile] === 1 ) {
              this.signalements.push(signalement);
            }

          }

          this.haveSignalements = true;
          this.signalements.sort((a, b) => {
            return this.numberSignalements[b.idProfile] - this.numberSignalements[a.idProfile];
          })
          console.log(this.signalements);

        }
      }, (error: any) => {
        console.log("Erreur lors de la récupération des signalements");
      }
    );

  }

  async getPhotoUserById(id: number){
    this.adminService.getUserById(id).subscribe(
      (data: UserSubscribe) => {
        this.photos[id] = data["user"].photo;
        this.names[id] = data["user"].login;
      }, (error: any) => {
        console.log("Erreur lors de la récupération de l'utilisateur");
      }
    );
  }

  goToSpecificProfile(id: number){
    this.router.navigate(['/admin/signalements/profile'], {queryParams: {id: id}});
  }

}
