import { Component, OnInit } from '@angular/core';
import {Signalement} from "../models/Signalement";
import {AdminService} from "../services/admin.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserSubscribe} from "../models/UserSubscribe";

@Component({
  selector: 'app-admin-signalement-profile',
  templateUrl: './admin-signalement-profile.component.html',
  styleUrls: ['./admin-signalement-profile.component.scss']
})
export class AdminSignalementProfileComponent implements OnInit {

  public haveSignalements: boolean = false;
  public signalements: Signalement[] = [];
  public idProfile: number;
  public userProfile: UserSubscribe;
  public usersInfo: UserSubscribe[] = [];
  public dateInfo: string[] = [];
  public isLoaded: boolean = false;
  public userLoaded: boolean = false;
  public loginLoaded: boolean = false;

  constructor(private adminService: AdminService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void{

    this.route.queryParams.subscribe(async params => {
      this.idProfile = params['id'];
    });

    this.initUserAdmin()
    this.getUserProfile(this.idProfile)
    this.getSignalementByProfile(this.idProfile)
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

  async getSignalementByProfile(idProfile: number){

    await this.adminService.getSignalementByIdProfile(idProfile).subscribe({
      next: async (data: Signalement[]) => {
        this.signalements = data["response"];
        this.haveSignalements = true;

        let cpt :number = 0
        for (let signalement of this.signalements) {
          await this.adminService.getUserById(signalement.idSignaler).subscribe({
            next: (data: UserSubscribe) => {
              this.usersInfo[signalement.idSignaler] = data["user"];
              if (signalement.id) {
                this.dateInfo[signalement.id] = signalement.dateTime.substring(0,4) + "-" + signalement.dateTime.substring(5,7) + "-" + signalement.dateTime.substring(8,10) + " " + signalement.dateTime.substring(11,13) + ":" + signalement.dateTime.substring(14,16) + ":00";
              }
              cpt++;
              if(cpt == this.signalements.length){
                this.loginLoaded = true;
              }
            }, error: (error: any) => {
              console.log("Pas de profil: " + error);
            }
          });
        }


      },error: (error: any) => {
        console.log("Pas de signalement: " + error);
      }
    });

  }


  async getUserProfile(idProfile: number): Promise<void> {
    await this.adminService.getUserById(idProfile).subscribe({
      next: (data: UserSubscribe) => {
        this.userProfile = data["user"];
        this.userLoaded = true;
      },error: (error: any) => {
        console.log("Pas de profil: " + error);
      }
    });
  }

  async goToSpecificProfile(id: number){
    console.log(id);
    this.adminService.getUserById(id).subscribe({
      next: (data: UserSubscribe) => {
        this.router.navigate(['/profile'], {queryParams: {login: data["user"].login}});
      },error: (error: any) => {
        console.log("Pas de profil: " + error);
      }
    });
  }

}
