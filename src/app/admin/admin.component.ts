import { Component, OnInit } from '@angular/core';
import {AdminService} from "../services/admin.service";
import {Router} from "@angular/router";
import {Signalement} from "../models/Signalement";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private adminService: AdminService, private router: Router) {
  }

  ngOnInit(): void {
    this.initUserAdmin();
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

  async goToSignalements() {
    await this.router.navigate(['/admin/signalements']);
  }

  async goToUsers() {
    await this.router.navigate(['/admin/users']);
  }

}
