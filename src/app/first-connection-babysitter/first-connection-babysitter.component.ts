import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ConnexionService} from "../services/connexion.service";
import {UserSubscribe} from "../models/UserSubscribe";
import {UpdateBabysitter} from "../models/UpdateBabysitter";
import {SubscribeService} from "../services/subscribe-service";
import {ActivatedRoute, Params, Router} from "@angular/router";


@Component({
  selector: 'app-first-connection-babysitter',
  templateUrl: './first-connection-babysitter.component.html',
  styleUrls: ['./first-connection-babysitter.component.css']
})
export class FirstConnectionBabysitterComponent implements OnInit {
  public returnError = false;
  public user: UserSubscribe = new UserSubscribe('', '', '', '', '', 0, 0, '');
  public pictureProfile: string | ArrayBuffer | null = "../../assets/avatar.png";
  public lengthTextAreaNumber: number = 0;
  public lengthSkill: number = 0;
  public model: string;
  public listAllCategories: string[] = [];
  public listUserCompetences: [{ category: string, skill: string }] = [{category: "", skill: ""}];
  public categorySelected: string = "";
  public addCompetencesBool: boolean = false;
  public errorMessage: string = "";
  public userId: number;

  updateBabysitter: UpdateBabysitter = new UpdateBabysitter();
  @ViewChild("skills") skills: ElementRef;


  constructor(private route: ActivatedRoute, private authService: ConnexionService, private subscribeService: SubscribeService, private router: Router) {
  }


  async ngOnInit(): Promise<void> {
    if (await this.getFirstConnexion()) {
      this.initUser();
      this.initCategories();
    } else {
      await this.router.navigate(['/login']);
    }
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      let extensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!extensions.exec(event.target.files[0].name)) {
        this.errorMessage = "Veuillez entrer une image valide";
        this.returnError = true;
        return;
      }
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        console.log(event.target)
        this.pictureProfile = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  closeAlert() {
    this.returnError = false;
  }

  async initUser() {
    let userService = await this.authService.isUserLoggedIn();
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (Object.keys(userService)[i] == "id") {
          this.userId = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'login') {
          this.user.login = Object.values(userService)[i];
        }
      }
    }
    return;
  }

  uploadButton() {
    let upload = <HTMLElement>document.querySelector('.file-upload');
    upload.click();
  }

  onKeyUpTextArea(box: HTMLTextAreaElement) {
    this.lengthTextAreaNumber = box.value.length;
  }

  onKeyUpSkill(box: HTMLInputElement) {
    this.lengthSkill = box.value.length;
  }

  onChange($event: any) {
    this.categorySelected = $event.target.value;
  }

  addCompetence(skill: string) {
    if (skill != "" && this.listUserCompetences.length < 5 && skill.length <= 20) {
      for (let i = 0; i < this.listUserCompetences.length; i++) {
        if (this.listUserCompetences[i]["skill"] == skill) {
          this.returnError = true;
          this.errorMessage = "Vous avez déjà cette compétence";
          return;
        }
      }
      let skillToAdd = {category: this.categorySelected, skill: skill};
      this.addCompetencesBool = true;
      if (this.listUserCompetences[0]["skill"] != "") {
        this.listUserCompetences.push(skillToAdd);
      } else {
        this.listUserCompetences[0] = skillToAdd;
      }
      this.skills.nativeElement.value = "";
      this.lengthSkill = 0;
    } else {
      this.returnError = true;
      this.errorMessage = "Veuillez entrer une compétence valide";
    }
  }

  removeElem(elem: string) {
    for (let i = 0; i < this.listUserCompetences.length; i++) {
      if (this.listUserCompetences[i]["skill"] == elem) {
        this.listUserCompetences.splice(i, 1);
      }
    }
  }

  validateInformation(box: string) {
    this.updateBabysitter = new UpdateBabysitter();
    this.updateBabysitter.id = this.userId;
    this.updateBabysitter.description = box;
    this.updateBabysitter.photo = this.pictureProfile;
    this.updateBabysitter.arraySkill = this.listUserCompetences;
    console.log("tata");
    this.subscribeService.insertBabysitter(this.updateBabysitter).subscribe(
      (data: any) => {
        //navigate to the next page
        if (data.response) {

          this.router.navigate(['/profile'], { queryParams: { login: this.user.login } });
        } else {
          this.returnError = true;
          this.errorMessage = data.message;
        }
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Une erreur est survenue " + error;
      });
  }

  private initCategories() {
    this.listAllCategories = [];
    this.subscribeService.initCategories().subscribe(
      (data: any) => {
        for (let elem of data.response) {
          this.listAllCategories.push(elem.name);
        }
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Une erreur est survenue " + error;
      });
  }

  private async getFirstConnexion() {
    return  await this.authService.getFirstConnexion();
  }
}
