import {Component, HostListener, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, switchMap} from "rxjs";
import {ConnexionService} from "../services/connexion.service";
import {ActivatedRoute, Params, Router} from "@angular/router";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  public isConnectedBool: boolean = false;
  public loginUser: string = "";
  public roleUser: string = "";
  constructor(private authService: ConnexionService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.route.queryParams.subscribe(async params => {
      await this.isConnected();
    });
  }

  public login: [string] = [""];
  public pictureProfile: string = "../assets/avatar.png";
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) => term.length < 2 ? []
        : this.login.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  private async getAllUsers() {
    let userService = await this.authService.getAllUsersNonBanned();
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (this.login[0] == "") {
          this.login[0] = Object.values(userService)[i]["login"];
        } else {
          this.login.push(Object.values(userService)[i]["login"]);
        }
      }
    }
  }

  async goToProfile(value: string) {
    if (this.login.includes(value)) {
      const queryParams: Params = {login: value};
      await this.router.navigate(
        ['/profile'],
        {
          queryParams: queryParams,
        });
    } else {
      console.log("not found");
    }
  }

  async isConnected() {
    let user = await this.authService.isUserLoggedIn();
    if(user) {
      if(Object.values(user)[8]){
        this.pictureProfile = Object.values(user)[8];
      }else{
        this.pictureProfile = "../assets/avatar.png";
        console.log("no picture");
      }

      let idUser = Object.values(user)[0];
      let role = await this.authService.getRole(idUser);
      if(role) {
        this.roleUser = role[0].role;
        console.log(this.roleUser);
      }

      this.loginUser = Object.values(user)[4];
    }
    this.isConnectedBool = !!user;
  }

  async isDeconnected() {
    this.authService.logout();
    this.isConnectedBool = false;
    await this.router.navigate(
      ['/login']);
  }
}
