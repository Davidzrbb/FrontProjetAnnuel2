import {Component, OnDestroy, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {AdminService} from "../services/admin.service";
import {Params, Router} from "@angular/router";
import {User} from "../models/User";
import {Subject} from 'rxjs';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  users: User[] = [];

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.initUserAdmin();
    this.dtOptions = {
      pagingType: 'full_numbers',
    }
    this.getUsers();
  }

  getUsers(): void {
    this.adminService.getUsers().subscribe(
      (data: any) => {
        this.users = data["response"];

      }, (error: any) => {

      }
    );
  }

  async initUserAdmin() {
    this.adminService.isUserLogin().subscribe(
      (data: any) => {
      }, (error: any) => {
        console.log("Vous n'êtes pas admin");
        this.router.navigate(['/home']);
      }
    );
  }

  async goToProfile(login: string) {
    const queryParams: Params = {login: login};
    await this.router.navigate(
      ['/profile'],
      {
        queryParams: queryParams,
      });
  }

  async banUser(id: number) {
    await this.adminService.banUser(id).subscribe(
      (data: any) => {
        this.getUsers();
      }, (error: any) => {

      }
    );
  }
  async unBanUser(id: number) {
    await this.adminService.unBanUser(id).subscribe(
      (data: any) => {
        this.getUsers();
      }, (error: any) => {

      }
    );
  }
}
