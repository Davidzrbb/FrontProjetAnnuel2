import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ConnexionService} from "../services/connexion.service";
import {UserSubscribe} from "../models/UserSubscribe";
import {Contract} from "../models/Contract";
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {ContractService} from "../services/contract.service";
import {debounceTime, distinctUntilChanged, map, Observable, OperatorFunction} from "rxjs";

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  public loading: boolean = false;
  public loginParam: string = "";
  public userIdByLogin: number;
  public user: UserSubscribe = new UserSubscribe('', '', '', '', '', null, 0, '');
  public contrat: Contract = new Contract(-1, -1, -1, null, 0, 0,
    "", 0, 0, null, null, 0);
  public pictureProfile: string = "../assets/avatar.png";
  public errorMessage: string = "";
  public returnError = false;
  public userIdByToken: number;
  public roleToken: string;
  public displayContractBool: boolean = false;
  public displayHistoryBool: boolean = false;
  public displayHours: boolean = false;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  public login: [string] = [""];
  contracts: any;
  paymentHandler: any = null;
  montant: number = 0;
  success: boolean = false
  failure: boolean = false
  displayQrCode: boolean = false;

  constructor(private route: ActivatedRoute, private authService: ConnexionService, private router: Router, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
              private contratService: ContractService) {
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) => term.length < 2 ? []
        : this.login.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  public urlConnexionQrCode: string;

  async ngOnInit() {
    this.invokeStripe();
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    this.route.queryParams.subscribe(async params => {
      this.loading = true;
      if (params['login']) {
        this.loginParam = params['login'];
        if (this.loginParam != "") {
          await this.initUserByLogin();
        }
      }
      await this.initUserByToken();
      await this.getAllUsers();
      this.loading = false;
    });
  }

  private async initUserByLogin() {
    let userService = await this.authService.getUserByLogin(this.loginParam);
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (Object.keys(userService)[i] == "id") {
          this.userIdByLogin = Object.values(userService)[i];
          this.user.id = this.userIdByLogin;
        }
        if (Object.keys(userService)[i] == 'login') {
          this.user.login = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'name') {
          this.user.name = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'lastname') {
          this.user.lastname = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'age') {
          this.user.age = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'photo') {
          if (Object.values(userService)[i] === null) {
            this.pictureProfile = "../assets/avatar.png";
          } else {
            this.pictureProfile = Object.values(userService)[i];
          }
        }
      }
      this.user.role = await this.initRole(this.userIdByLogin);
    } else {
      await this.router.navigate(['/login']);
      return;
    }
  }

  private async initUserByToken() {
    let userService = await this.authService.isUserLoggedIn();
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (Object.keys(userService)[i] == 'id') {
          this.userIdByToken = Object.values(userService)[i];
        }

      }
    } else {
      await this.router.navigate(['/login']);
      return;
    }
    this.roleToken = await this.initRole(this.userIdByToken);
  }

  private async getAllUsers() {
    let userService = await this.authService.getAllUsersNonBanned();
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (await this.initRole(Object.values(userService)[i]['id']) == "babysitter") {
          if (this.login[0] == "") {
            this.login[0] = Object.values(userService)[i]["login"];
          } else {
            this.login.push(Object.values(userService)[i]["login"]);
          }
        }
      }
    }
  }

  private async initRole(idUser: number) {
    let role = await this.authService.getRoleByToken(idUser);
    if (role) {
      return Object.values(role)[0]['role'];
    } else {
      this.user.role = "";
      this.errorMessage = "Veuillez vous reconnecter";
      this.returnError = true;
    }
  }

  closeAlert() {
    this.returnError = false;
  }

  displayContract() {
    this.displayContractBool = !this.displayContractBool;
    this.displayHistoryBool = false;
    this.displayHours = false;
  }

  displayHistory() {
    this.displayHistoryBool = !this.displayHistoryBool;
    this.displayContractBool = false;
    this.displayHours = false;
    if (this.roleToken == "babysitter") {
      this.getAllContractsByBabysitter();
    }
    if (this.roleToken == "parent") {
      this.getAllContractsByParent();
    }
  }

  saveBabysitter() {
    if (this.userIdByLogin) {
      this.contrat.idBabysitter = this.userIdByLogin;
      this.contrat.idParent = this.userIdByToken;
      this.displayHours = true;
    } else {
      this.errorMessage = "Erreur avec les champs";
      this.returnError = true;
    }
  }

  saveHours(hourlyWage: string, startDate: string, endDate: string, hoursTotal: string) {
    if (hourlyWage && parseInt(hourlyWage) > 0 && startDate && endDate && hoursTotal && parseInt(hoursTotal) > 0 && this.fromDate && this.toDate) {
      const startDateFormate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      const endDateFormate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);

      if (startDateFormate < endDateFormate && startDateFormate > new Date() && endDateFormate > new Date()) {
        this.contrat.hourlyWage = parseInt(hourlyWage);
        this.contrat.startDate = startDateFormate;
        this.contrat.endDate = endDateFormate;
        this.contrat.numberOfHours = parseInt(hoursTotal);
        this.contrat.step = 0;
        this.contratService.insertContract(this.contrat).subscribe(
          (data: any) => {
            //navigate to the next page
            if (data.response) {
              this.displayContract();
            } else {
              this.returnError = true;
              this.errorMessage = data.message;
            }
          }, (error: any) => {
            this.returnError = true;
            this.errorMessage = "Une erreur est survenue ";
          });
      } else {
        this.returnError = true;
        this.errorMessage = "Veuillez entrer des dates valides";
      }
    } else {
      this.errorMessage = "Veuillez remplir tous les champs";
      this.returnError = true;
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  async replaceBabysitter(value: string) {
    if (this.login.includes(value)) {
      const queryParams: Params = {login: value};
      await this.router.navigate(
        ['/contrat'],
        {
          queryParams: queryParams,
        });
    } else {
      this.returnError = true;
      this.errorMessage = "Ce babysitter n'existe pas";
    }
  }

  private getAllContractsByParent() {
    this.contratService.getAllContractsByParent(this.userIdByToken).subscribe(
      (data: any) => {
        if (data.response) {
          this.contracts = data.response;
        } else {
          this.returnError = true;
          this.errorMessage = data.message;
        }
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Une erreur est survenue ";
      }
    );
  }

  private getAllContractsByBabysitter() {
    this.contratService.getAllContractsByBabysitter(this.userIdByToken).subscribe(
      (data: any) => {
        if (data.response) {
          this.contracts = data.response;
        } else {
          this.returnError = true;
          this.errorMessage = data.message;
        }
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Une erreur est survenue ";
      }
    );
  }

  async moveToHtmlContract(id: number) {
    let check: boolean = false;
    for (let i = 0; i < this.contracts.length; i++) {
      if (this.contracts[i]["id"] == id) {
        check = true;
        break;
      }
    }
    if (check) {
      const queryParams: Params = {id: id};
      await this.router.navigate(
        ['/html-contract'],
        {
          queryParams: queryParams,
        });
    } else {
      this.returnError = true;
      this.errorMessage = "Ce contrat n'existe pas";
    }
  }

  updateStep(id: number, step: number) {
    //update contrat step
    this.contratService.updateStepValidate(id, step).then(
      (data: any) => {
        if (data.response) {
          for (let i = 0; i < this.contracts.length; i++) {
            if (this.contracts[i]["id"] == id) {
              this.contracts[i]["step"] = step;
            }
          }
        } else {
          this.returnError = true;
          this.errorMessage = data.message;
        }
      });
  }


  stopContract(id: number) {

  }

  makePayment(id: number) {
    for (let i = 0; i < this.contracts.length; i++) {
      if (this.contracts[i]["id"] == id) {
        console.log(this.contracts[i]);
        this.montant = (this.contracts[i]["hourlyWage"] * this.contracts[i]["numberOfHourDone"]) * 100;
      }
    }
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51LJduaAGkSy9SO1IK6uuwrGoq0O1c9YbdmRNax71EF9V5XWlEisY4zDL6n8YAgBKvrbFZxlRYvz67vDYd5lnVfyI00pKeVBnKG',
      locale: 'auto',
      token: function (stripeToken: any) {
        paymentstripe(stripeToken);
      },
    });

    const paymentstripe = (stripeToken: any) => {
      let data = {amount: this.montant, id: stripeToken.id, email: stripeToken.email};
      this.contratService.stripe(data).subscribe((data: any) => {
        if (data.data === "success") {
          this.success = true
          this.returnError = true;
          this.errorMessage = "Paiement effectué avec succès";
          this.updateStep(id, 3)
        } else {
          this.failure = true
          this.returnError = true;
          this.errorMessage = "Erreur lors de la transaction";
        }
      });
    };

    paymentHandler.open({
      name: 'Stripe',
      description: 'Montant à payer : ' + this.montant / 100 + '€',
      amount: this.montant
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51LJduaAGkSy9SO1IK6uuwrGoq0O1c9YbdmRNax71EF9V5XWlEisY4zDL6n8YAgBKvrbFZxlRYvz67vDYd5lnVfyI00pKeVBnKG',
          locale: 'auto',
          token: function (stripeToken: any) {

          },
        });
      };

      window.document.body.appendChild(script);
    }
  }

  generateQRCODE(id: number) {
    console.log(this.contracts);
    if (id != -1) {
      for (let i = 0; i < this.contracts.length; i++) {
        if (this.contracts[i]["id"] == id) {
          this.urlConnexionQrCode = "http://51.38.190.134:4200/qrcode-connexion?idParent=" + this.contracts[i].idParent + "&idBabysitter=" + this.contracts[i].idBabysitter + "&idContract=" + this.contracts[i].id;
        }
      }
    }
    this.displayQrCode = !this.displayQrCode;
  }
}
