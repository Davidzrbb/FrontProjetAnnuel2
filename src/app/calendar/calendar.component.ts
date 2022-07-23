import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConnexionService} from "../services/connexion.service";
import {AvailabilityService} from "../services/availability.service";
import {ActivatedRoute} from "@angular/router";
import {UpdateAvaibality} from "../models/UpdateAvaibality";

interface Country {
  name: string;
  flag: string;
  area: number | undefined;
  population: number | undefined;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() item;
  @Output() newItemEvent = new EventEmitter<string[][]>();
  daysArray = new Array(24);

  days = [{
    _lundi: "",
    _mardi: "",
    _mercredi: "",
    _jeudi: "",
    _vendredi: "",
    _samedi: "",
    _dimanche: ""
  }];
  public idUser: number;
  public loginParam: string = "";
  public availabilityTest: string[][] = [];
  updateAvaibality: UpdateAvaibality = new UpdateAvaibality();
  public wait: boolean = false;

  constructor(private authService: ConnexionService, private availableService: AvailabilityService, private route: ActivatedRoute) {
  }


  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.loginParam = params['login'];
      if (this.loginParam) {
        await this.initUserByLogin();
        await this.getAvailabilityParseByUserId();
      } else {
        await this.initDays();
        await this.initAvailabilityUser();
        await this.getAvailabilityParseByUserId();
      }
    });

  }

  private async initDays() {
    for (let i = 0; i < this.daysArray.length; i++) {
      this.daysArray[i] = {
        _lundi: "",
        _mardi: "",
        _mercredi: "",
        _jeudi: "",
        _vendredi: "",
        _samedi: "",
        _dimanche: ""
      };
    }
    this.days = this.daysArray;
  }

  private getAvailabilityParseByUserId() {
    if (this.idUser) {
      this.availableService.getAvailabilityParseByUserId(this.idUser.toString()).subscribe(
        (data: any) => {
          if (data.response) {
            this.days = data.response.listCalendar;
            this.initAvailabilityUser();
          }
        });
    }
  }

  private async initUserByLogin() {
    let userService = await this.authService.getUserByLogin(this.loginParam);
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (Object.keys(userService)[i] == 'id') {
          this.idUser = Object.values(userService)[i];
        }
      }
    }
  }

  public initAvailabilityUser() {
    let lundi: string[] = new Array(25)
    let mardi: string[] = new Array(25)
    let mercredi: string[] = new Array(25)
    let jeudi: string[] = new Array(25)
    let vendredi: string[] = new Array(25)
    let samedi: string[] = new Array(25)
    let dimanche: string[] = new Array(25)
    lundi[0] = "lundi"
    mardi[0] = "mardi"
    mercredi[0] = "mercredi"
    jeudi[0] = "jeudi"
    vendredi[0] = "vendredi"
    samedi[0] = "samedi"
    dimanche[0] = "dimanche"
    this.availabilityTest.push(lundi)
    this.availabilityTest.push(mardi)
    this.availabilityTest.push(mercredi)
    this.availabilityTest.push(jeudi)
    this.availabilityTest.push(vendredi)
    this.availabilityTest.push(samedi)
    this.availabilityTest.push(dimanche)
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i]._lundi === "X") {
        this.availabilityTest[0][i + 1] = "X";
      }
      if (this.days[i]._mardi === "X") {
        this.availabilityTest[1][i + 1] = "X";
      }
      if (this.days[i]._mercredi === "X") {
        this.availabilityTest[2][i + 1] = "X";
      }
      if (this.days[i]._jeudi === "X") {
        this.availabilityTest[3][i + 1] = "X";
      }
      if (this.days[i]._vendredi === "X") {
        this.availabilityTest[4][i + 1] = "X";
      }
      if (this.days[i]._samedi === "X") {
        this.availabilityTest[5][i + 1] = "X";
      }
      if (this.days[i]._dimanche === "X") {
        this.availabilityTest[6][i + 1] = "X";
      }
    }
  }

  logDay(name: string, hours: number, check: string) {
    if (!this.loginParam) {

    }
    console.log(this.days)
    for (let i = 0; i < this.availabilityTest.length; i++) {
      if (this.availabilityTest[i][0] === name) {
        if (check === "X") {
          check = "";
          this.availabilityTest[i][hours + 1] = check;
        } else {
          check = "X";
          this.availabilityTest[i][hours + 1] = check;
        }
      }
    }
    let nameTmp = "_" + name;
    this.days[hours][nameTmp] = check;
    this.addNewItem(this.availabilityTest)
  }

  addNewItem(value: string[][]) {
    this.newItemEvent.emit(value);
  }


}
