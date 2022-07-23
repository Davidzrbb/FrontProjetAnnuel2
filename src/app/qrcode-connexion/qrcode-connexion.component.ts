import {Component, OnInit} from '@angular/core';
import {ConnexionService} from "../services/connexion.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

import {SubscribeService} from "../services/subscribe-service";
import {AvailabilityService} from "../services/availability.service";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {ContractService} from "../services/contract.service";
import {UserConnectQRCode} from "../models/UserConnectQRCode";

@Component({
  selector: 'app-qrcode-connexion',
  templateUrl: './qrcode-connexion.component.html',
  styleUrls: ['./qrcode-connexion.component.scss']
})
export class QrcodeConnexionComponent implements OnInit {
  private idBabysitter: number = -1;
  private idContract: number = -1;

  constructor(private authService: ConnexionService, private updateUserService: SubscribeService, private route: ActivatedRoute, private subscribeService: SubscribeService, private router: Router,
              private availableService: AvailabilityService, private config: NgbRatingConfig, private contractService: ContractService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.idBabysitter = parseInt(params['idBabysitter']);
      this.idContract = parseInt(params['idContract']);
    });
  }


  public returnError: boolean = false;
  public clickConnect: boolean = false;
  public updateHoursBool: boolean = false;
  public errorMessage = "";
  public contract = []
  public contractBool: boolean = false;

  checkConnected(pseudo: string, password: string): void {
    this.clickConnect = true;
    if (pseudo.trim() != "" && password.trim() != "") {
      let userConnectQRCode: UserConnectQRCode = new UserConnectQRCode(pseudo, password, this.idBabysitter, this.idContract);
      this.authService.connectUserQrCode(userConnectQRCode).subscribe(
        async res => {
          if (res.response) {
            this.returnError = false;
            if (res.response === "parent") {
              this.updateHoursBool = true;
            } else {
              this.returnError = true;
              this.errorMessage = "Vous n'êtes pas un parent";
            }
          } else {
            this.returnError = true;
            this.errorMessage = "Votre pseudo ou votre mot de passe est incorrect";
          }
          this.clickConnect = false;
        },
        error => {
          this.returnError = true;
          this.errorMessage = "Erreur de connexion";
          this.clickConnect = false;
        });
    } else {
      this.returnError = true;
    }
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem("token") != null;
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  closeAlert() {
    this.returnError = false;
  }

  updateHours(hoursToDone: string) {
    this.contract = [];
    let hours: number = parseInt(hoursToDone);
    if (hours > 0 && hours < 24) {
      this.contractService.updateHours(this.idContract, hours).then(
        res => {
          if (res['response']) {
            console.log(res['response']);
            this.contract = res['response'][0];
            this.contractBool = true;
          } else {
            this.returnError = true;
            this.updateHoursBool = false;
            this.errorMessage = "Erreur de mise à jour des heures";
          }
        }
      );
    } else {
      this.updateHoursBool = false;
      this.returnError = true;
      this.errorMessage = "Veuillez entrer un nombre supérieur à 0";
    }
  }
}
