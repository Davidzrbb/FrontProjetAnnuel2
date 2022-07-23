import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ConnexionService} from "../services/connexion.service";
import {UserSubscribe} from "../models/UserSubscribe";
import {SubscribeService} from "../services/subscribe-service";
import {ActivatedRoute, Router} from "@angular/router";
import {UpdateBabysitter} from "../models/UpdateBabysitter";
import {AvailabilityService} from "../services/availability.service";
import {UpdateAvaibality} from "../models/UpdateAvaibality";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {PostsService} from "../services/posts.service";
import {AdminService} from "../services/admin.service";
import {User} from "../models/User";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userId: number;
  public roleId: number;
  public errorMessage: string = "";
  public returnError = false;
  public user: UserSubscribe = new UserSubscribe('', '', '', '', '', 0, 0, '');
  public sexeUser: string = "";
  public sexe = "1";
  public lengthTextAreaNumber: number = 0;
  public saveDisabled: boolean = false;
  public loginParam: string = "";
  public samePeople: boolean = false;
  public displaySkillsListBool: boolean = false;
  public displayAgendaBool: boolean = false;
  public displayInformationsBool: boolean = false;
  public modificationUserBool: boolean = false;
  public modificationSkillsBool: boolean = false;
  public addSkillBool: boolean = false;
  public addAvaibalityBool: boolean = false;
  public modificationAvaibalityBool: boolean = false;
  public displayCommentBool: boolean = false;
  public listAllCategories: string[] = [];
  public displayMoreComment: boolean = false;
  public listAllSkills: any = [];
  public idToken: number = 0;
  public userBan: User;
  public listAllAvaibality: [{ id: number, day: string, startHour: number, endHour: number }] = [{
    id: -1,
    day: '',
    startHour: -1,
    endHour: -1
  }];
  public listAllAvaibalityUpdate: [{ day: string, id: number, startHour: number, endHour: number, index: number }] = [{
    id: -1,
    day: '',
    startHour: -1,
    endHour: -1,
    index: 0
  }];
  public listAllSkillsTmp: [{ category: string, id: number, skill: string }] = [{skill: '', id: -1, category: ''}];
  updateBabysitter: UpdateBabysitter = new UpdateBabysitter();
  updateAvaibality: UpdateAvaibality = new UpdateAvaibality();
  public listAllSkillsUpdate: [{ skill: string, id: number, category: string, index: number }] = [{
    skill: '',
    id: -1,
    category: '',
    index: 0
  }];
  Object = Object;
  pictureProfile: string = "../assets/avatar.png";
  private categorySelected: string;
  loading: boolean = false;
  listAllDay = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  listAllHour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  currentRate: number = 0;
  public listAllComments: any;
  private availabilityTest: string[][];
  public displaySignalementBool: boolean = false;
  public noComment: boolean = true;
  public displayCertifiedBool: boolean = false;
  public skillId: number;
  public returnSucces: boolean = false;
  public success: string = "success";
  public images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  public listPosts: any = [];
  public noPost: boolean = false;
  public displayUpdatePost: boolean = false;
  public idPostUpdate: number;
  public roleByToken: string;

  constructor(private authService: ConnexionService, private updateUserService: SubscribeService,
              private route: ActivatedRoute, private subscribeService: SubscribeService, private router: Router,
              private availableService: AvailabilityService, private config: NgbRatingConfig,
              private postsService: PostsService, private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.config.max = 5;
    this.route.queryParams.subscribe(async params => {
      this.loading = true;
      this.loginParam = params['login'];
      if (!this.loginParam) {
        await this.router.navigate(['/login']);
        return;
      }
      await this.initUserByLogin().then(async () => {await this.initBanUser()
        await this.initUserByToken();
        await this.initSkills();
        await this.initAllAvaibality()
        await this.getAllComments();
        await this.initPosts();});

      this.loading = false;
    });
  }

  async initUserByToken() {
    let userService = await this.authService.isUserLoggedIn();
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (Object.keys(userService)[i] == 'login') {
          this.samePeople = this.loginParam == Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'id') {
          this.idToken = Object.values(userService)[i];
        }
      }
      this.roleByToken = await this.initRole(this.idToken);
    } else {
      await this.router.navigate(['/login']);
      return;
    }
  }

  async initUserByLogin() {
    let userService = await this.authService.getUserByLogin(this.loginParam);
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (Object.keys(userService)[i] == "id") {
          this.userId = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'login') {
          this.user.login = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'lastname') {
          this.user.lastname = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'name') {
          this.user.name = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'email') {
          this.user.email = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'photo') {
          if (Object.values(userService)[i] === null) {
            this.pictureProfile = "../assets/avatar.png";
          } else {
            this.pictureProfile = Object.values(userService)[i];
          }
        }
        if (Object.keys(userService)[i] == 'description') {
          this.user.description = Object.values(userService)[i];
          if (Object.values(userService)[i])
            this.lengthTextAreaNumber = Object.values(userService)[i].length;
        }
        if (Object.keys(userService)[i] == 'age') {
          this.user.age = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'id_role') {
          this.roleId = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'sexe') {
          this.sexe = Object.values(userService)[i].toString();
          if (Object.values(userService)[i] == 1) {
            this.sexeUser = 'Homme';
          } else {
            this.sexeUser = 'Femme';
          }
        }
      }
      this.user.role = await this.initRole(this.userId);
    } else {
      await this.router.navigate(['/login']);
      return;
    }
  }

  async initRole(id: number): Promise<string> {
    let role = await this.authService.getRoleByToken(id);
    if (role) {
      return Object.values(role)[0]['role'];
    } else {
      this.errorMessage = "Veuillez vous reconnecter";
      this.returnError = true;
      return "";
    }
  }

  closeAlert() {
    this.returnError = false;
    this.returnSucces = false;
  }

  modificationUser() {
    this.modificationUserBool = !this.modificationUserBool;
  }

  modificationSkills() {
    this.modificationSkillsBool = !this.modificationSkillsBool;
    this.initCategories();
  }

  modifySexe(value: string) {
    this.sexe = value;
  }

  onKeyUpTextArea(box: HTMLTextAreaElement) {
    this.lengthTextAreaNumber = box.value.length;
  }

  updateUser() {
    if (this.modificationUserBool) {
      this.user.sexe = parseInt(this.sexe);
      this.user.id = this.userId;
      if (this.user.sexe != 1 && this.user.sexe != 2) {
        this.errorMessage = "Erreur avec le sexe"
        this.returnError = true;
        return;
      }
      if (!this.user.age || this.user.login && !this.user.lastname || !this.user.name || !this.user.email || !this.user.sexe) {
        this.errorMessage = "Veuillez remplir tous les champs";
        this.returnError = true;
        return;
      }
      if (this.user.age < 16) {
        this.errorMessage = "Age minimum 16 ans"
        this.returnError = true;
        return;
      }
      if (this.user.age > 100) {
        this.errorMessage = "Age maximum 100 ans"
        this.returnError = true;
        return;
      }
      if (this.user.description && this.user.description.length > 100) {
        this.errorMessage = "Description trop longue"
        this.returnError = true;
        return;
      }
      this.saveDisabled = true;
      this.updateUserService.updateUser(this.user).subscribe(
        (data: any) => {
          if (data.response) {
            this.modificationUserBool = false;
            this.saveDisabled = false;
          } else {
            this.errorMessage = "Erreur lors de la modification";
            this.returnError = true;
          }
        });
    }
  }

  private initSkills() {
    this.listAllSkills = [{skill: '', id: -1, category: ''}];
    this.authService.getSkills(this.user.login).then(
      (data: any) => {
        if (data.response) {
          for (let i = 0; i < data.response.length; i++) {
            if (this.listAllSkills[0].skill == '') {
              this.listAllSkills[0] = {
                skill: data.response[i]["name"],
                id: data.response[i]["id"],
                category: data.response[i]["test"],
                certified: data.response[i]["certified"],
                detail: data.response[i]["detail"]
              };
            } else {
              this.listAllSkills.push({
                skill: data.response[i]["name"],
                id: data.response[i]["id"],
                category: data.response[i]["test"],
                certified: data.response[i]["certified"],
                detail: data.response[i]["detail"]
              });
            }
          }
        } else {
          this.errorMessage = "Erreur lors de la récupération des compétences";
          this.returnError = true;
        }
      }
    );
  }

  displaySkillsList() {
    this.displaySkillsListBool = !this.displaySkillsListBool;
    this.displayAgendaBool = false;
    this.displayInformationsBool = false;
  }

  displayAgenda() {
    this.displayAgendaBool = !this.displayAgendaBool;
    this.displaySkillsListBool = false;
    this.displayInformationsBool = false;
  }

  displayInformations() {
    this.displayInformationsBool = !this.displayInformationsBool;
    this.displaySkillsListBool = false;
    this.displayAgendaBool = false;
  }

  insertSkills() {
    if (this.addSkillBool) {
      if (this.listAllSkills.length >= 5) {
        this.errorMessage = "Vous avez atteint le nombre maximum de compétences";
        this.returnError = true;
        return;
      } else if (this.listAllSkillsUpdate[0].skill.length > 20) {
        this.errorMessage = "Nom de compétence trop long max 20 caractères";
        this.returnError = true;
        return;
      } else if (this.listAllSkillsUpdate[0].skill.length == 0) {
        this.errorMessage = "Veuillez entrer un nom de compétence";
        this.returnError = true;
        return;
      } else if (this.listAllSkillsUpdate[0].category.length == 0) {
        this.errorMessage = "Veuillez entrer une catégorie";
        this.returnError = true;
        return;
      }

      if (this.countInArray(this.listAllSkills, this.listAllSkills[0].skill) > 1) {
        this.errorMessage = "Vous avez déjà une compétence portant ce nom";
        this.returnError = true;
        return;
      }

      this.listAllSkillsTmp = this.listAllSkillsUpdate;
      this.listAllSkills.push(this.listAllSkillsTmp[0])
      this.modificationSkillsBool = false;
      this.addSkillBool = false;
      this.listAllSkillsUpdate = [{skill: '', id: -1, category: '', index: 0}];
      this.updateBabysitter.id = this.userId;
      this.updateBabysitter.arraySkill = this.listAllSkillsTmp;
      this.subscribeService.insertBabysitter(this.updateBabysitter).subscribe(
        (data: any) => {
          //navigate to the next page
          if (data.response) {
            this.returnSucces = true;
            this.errorMessage = "Compétences ajoutées avec succès";
            this.displaySkillsList()
            this.modificationSkillsBool = false;
            this.addSkillBool = false;

          } else {
            this.returnError = true;
            this.errorMessage = data.message;
          }
        }, (error: any) => {
          this.returnError = true;
          this.errorMessage = "Une erreur est survenue " + error;
        });
    }
  }

  updateSkills() {
    if (this.modificationSkillsBool) {
      for (let i = 0; i < this.listAllSkillsUpdate.length; i++) {
        if (this.listAllSkillsUpdate.length >= 5) {
          this.errorMessage = "Vous avez atteint le nombre maximum de compétences";
          this.returnError = true;
          return;
        } else if (this.listAllSkillsUpdate[i].skill.length > 20) {
          this.errorMessage = "Nom de compétence trop long max 20 caractères";
          this.returnError = true;
          return;
        }
        if (this.listAllSkillsUpdate[i].skill != '') {
          this.listAllSkills[this.listAllSkillsUpdate[i].index].skill = this.listAllSkillsUpdate[i].skill;
          this.listAllSkills[this.listAllSkillsUpdate[i].index].id = this.listAllSkillsUpdate[i].id;
        }
        if (this.listAllSkillsUpdate[i].category != '') {
          this.listAllSkills[this.listAllSkillsUpdate[i].index].category = this.listAllSkillsUpdate[i].category;
          this.listAllSkills[this.listAllSkillsUpdate[i].index].id = this.listAllSkillsUpdate[i].id;
        }
      }
      for (let i = 0; i < this.listAllSkills.length; i++) {
        if (this.countInArray(this.listAllSkills, this.listAllSkills[i].skill) > 1) {
          this.errorMessage = "Vous avez déjà une compétence portant ce nom";
          this.returnError = true;
          return;
        }
      }

      this.modificationSkillsBool = false;
      this.addSkillBool = false;
      this.listAllSkillsUpdate = [{skill: '', id: -1, category: '', index: 0}];
      this.updateBabysitter.id = this.userId;
      this.updateBabysitter.arraySkill = this.listAllSkills;

      this.subscribeService.updateSkillsBabysitter(this.updateBabysitter).subscribe(
        (data: any) => {
          //navigate to the next page
          if (data.response) {
            this.modificationSkillsBool = false;
            this.addSkillBool = false;
          } else {
            this.returnError = true;
            this.errorMessage = data.message;
          }
        }, (error: any) => {
          this.returnError = true;
          this.errorMessage = "Une erreur est survenue " + error;
        });
    }
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

  onChangeCategorie($event: any, index: number, id: number) {
    if ($event.target.value == '') {
      return;
    }
    let categorie = $event.target.value;
    if (this.modificationSkillsBool && index != -1) {
      if (this.listAllSkillsUpdate[0].skill == "" && this.listAllSkillsUpdate[0].category == "") {
        this.listAllSkillsUpdate[0].category = categorie;
        this.listAllSkillsUpdate[0].index = index;
        this.listAllSkillsUpdate[0].id = id;
      } else {
        for (let i = 0; i < this.listAllSkillsUpdate.length; i++) {
          if (this.listAllSkillsUpdate[i].index == index) {
            this.listAllSkillsUpdate[i].category = categorie;
            this.listAllSkillsUpdate[i].id = id;
            this.listAllSkillsUpdate[i].index = index;
            return;
          }
        }
        this.listAllSkillsUpdate.push({skill: '', id: id, category: categorie, index: index});
      }
    }

    if (this.addSkillBool && index == -1) {
      if (this.listAllSkillsUpdate[0].skill == "") {
        this.listAllSkillsUpdate[0].category = categorie;
        this.listAllSkillsUpdate[0].id = id;
        this.listAllSkillsUpdate[0].index = index;
      } else {
        for (let i = 0; i < this.listAllSkillsUpdate.length; i++) {
          if (this.listAllSkillsUpdate[i].index == index) {
            this.listAllSkillsUpdate[i].category = categorie;
            this.listAllSkillsUpdate[i].id = id;
            this.listAllSkillsUpdate[i].index = -1;
            return;
          }
        }
        this.listAllSkillsUpdate.push({skill: '', id: id, category: categorie, index: -1});
      }
    }
  }

  onChangeSkill($event: any, index: number, id: number) {
    if ($event.target.value == '') {
      return;
    }
    let skill = $event.target.value;
    if (this.modificationSkillsBool && index != -1) {
      if (this.listAllSkillsUpdate[0].skill == "") {
        this.listAllSkillsUpdate[0].skill = skill;
        this.listAllSkillsUpdate[0].id = id;
        this.listAllSkillsUpdate[0].index = index;
      } else {
        for (let i = 0; i < this.listAllSkillsUpdate.length; i++) {
          if (this.listAllSkillsUpdate[i].index == index) {
            this.listAllSkillsUpdate[i].skill = skill;
            this.listAllSkillsUpdate[0].id = id;
            this.listAllSkillsUpdate[i].index = index;
            return;
          }
        }
        this.listAllSkillsUpdate.push({skill: skill, id: id, category: '', index: index});
      }
    }
    if (this.addSkillBool && index == -1) {
      if (this.listAllSkillsUpdate[0].skill == "") {
        this.listAllSkillsUpdate[0].skill = skill;
        this.listAllSkillsUpdate[0].id = id;
        this.listAllSkillsUpdate[0].index = index;
      } else {
        for (let i = 0; i < this.listAllSkillsUpdate.length; i++) {
          if (this.listAllSkillsUpdate[i].index == index) {
            this.listAllSkillsUpdate[i].skill = skill;
            this.listAllSkillsUpdate[0].id = id;
            this.listAllSkillsUpdate[i].index = -1;
            return;
          }
        }
        this.listAllSkillsUpdate.push({skill: skill, id: id, category: '', index: -1});
      }
    }
  }

  countInArray(array: any, what: string) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i].skill === what) {
        count++;
      }
    }
    return count;
  }

  countInArrayAvaibality(array: any, what: string) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i].day === what) {
        count++;
      }
    }
    return count;
  }

  async addSkill() {
    this.addSkillBool = !this.addSkillBool;
    this.initCategories();
  }

  cancel() {
    this.modificationSkillsBool = false;
    this.modificationUserBool = false;
    this.addSkillBool = false;
    this.modificationAvaibalityBool = false;
    this.addAvaibalityBool = false;
    this.listAllSkillsUpdate = [{skill: '', id: -1, category: '', index: 0}];
  }

  deleteSkill(index: number, id: number) {
    //supprimer la skill de la liste
    this.listAllSkills.splice(index, 1);
    //supprimer la skill de la liste update
    for (let i = 0; i < this.listAllSkillsUpdate.length; i++) {
      if (this.listAllSkillsUpdate[i].id == id) {
        this.listAllSkillsUpdate.splice(i, 1);
        return;
      }
    }
    //suprimer le skill dans la base de données
    this.subscribeService.deleteSkill(id).subscribe(
      (data: any) => {
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Une erreur est survenue " + error;
      });
  }

  deleteAvaibality(index: number, id: number) {
    //supprimer la skill de la liste
    this.listAllAvaibality.splice(index, 1);
    //supprimer la skill de la liste update
    for (let i = 0; i < this.listAllAvaibalityUpdate.length; i++) {
      if (this.listAllSkillsUpdate[i].id == id) {
        this.listAllSkillsUpdate.splice(i, 1);
        return;
      }
    }
    //suprimer le skill dans la base de données
    this.availableService.deleteAvaibality(id).subscribe(
      (data: any) => {
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Une erreur est survenue " + error;
      });
  }

  addAvaibality() {
    this.addAvaibalityBool = true;
    this.modificationAvaibalityBool = false;
  }


  initAllAvaibality() {
    this.listAllAvaibality = [{
      id: -1,
      day: '',
      startHour: -1,
      endHour: -1
    }];
    //getAvaibalityById
    this.availableService.getByUserId(this.userId).subscribe(
      (data: any) => {
        if (data.response) {
          for (let i = 0; i < data.response.length; i++) {
            if (this.listAllAvaibality[0].day == '') {
              this.listAllAvaibality[0] = {
                id: data.response[i].id,
                day: data.response[i]["day"],
                startHour: data.response[i]["startHour"],
                endHour: data.response[i]["endHour"]
              };
            } else {
              this.listAllAvaibality.push({
                id: data.response[i].id,
                day: data.response[i]["day"],
                startHour: data.response[i]["startHour"],
                endHour: data.response[i]["endHour"]
              });
            }
          }
        }
      });
  }

  modificationAvailability() {
    this.modificationAvaibalityBool = true;
    this.addAvaibalityBool = false;
  }

  onChangeDay($event: any, index: number, id: number) {
    if ($event.target.value == '') {
      return;
    }
    let day = $event.target.value;
    if (this.modificationAvaibalityBool && index != -1) {
      if (this.listAllAvaibalityUpdate[0].day == "") {
        this.listAllAvaibalityUpdate[0].day = day;
        this.listAllAvaibalityUpdate[0].id = id;
        this.listAllAvaibalityUpdate[0].index = index;
      } else {
        for (let i = 0; i < this.listAllAvaibalityUpdate.length; i++) {
          if (this.listAllAvaibalityUpdate[i].index == index) {
            this.listAllAvaibalityUpdate[i].day = day;
            this.listAllAvaibalityUpdate[0].id = id;
            this.listAllAvaibalityUpdate[i].index = index;
            return;
          }
        }
        this.listAllAvaibalityUpdate.push({day: day, id: id, startHour: -1, endHour: -1, index: index});
      }
    }

    if (this.addAvaibalityBool && index == -1) {
      if (this.listAllAvaibalityUpdate[0].day == "") {
        this.listAllAvaibalityUpdate[0].day = day;
        this.listAllAvaibalityUpdate[0].id = id;
        this.listAllAvaibalityUpdate[0].index = index;
      } else {
        for (let i = 0; i < this.listAllAvaibalityUpdate.length; i++) {
          if (this.listAllAvaibalityUpdate[i].index == index) {
            this.listAllAvaibalityUpdate[i].day = day;
            this.listAllAvaibalityUpdate[0].id = id;
            this.listAllAvaibalityUpdate[i].index = -1;
            return;
          }
        }
        this.listAllAvaibalityUpdate.push({day: day, id: id, startHour: -1, endHour: -1, index: -1});
      }
    }
  }

  onChangeHourStart($event: any, index: number, id: number) {
    if ($event.target.value == '') {
      return;
    }
    let startHour = $event.target.value;
    if (this.modificationAvaibalityBool && index != -1) {
      if (this.listAllAvaibalityUpdate[0].day == "" && this.listAllAvaibalityUpdate[0].startHour == -1) {
        this.listAllAvaibalityUpdate[0].startHour = startHour;
        this.listAllAvaibalityUpdate[0].index = index;
        this.listAllAvaibalityUpdate[0].id = id;
      } else {
        for (let i = 0; i < this.listAllAvaibalityUpdate.length; i++) {
          if (this.listAllAvaibalityUpdate[i].index == index) {
            this.listAllAvaibalityUpdate[i].startHour = startHour;
            this.listAllAvaibalityUpdate[i].id = id;
            this.listAllAvaibalityUpdate[i].index = index;
            return;
          }
        }
        this.listAllAvaibalityUpdate.push({day: '', id: id, startHour: startHour, endHour: -1, index: index});
      }
    }
    if (this.addAvaibalityBool && index == -1) {
      if (this.listAllAvaibalityUpdate[0].day == "") {
        this.listAllAvaibalityUpdate[0].startHour = startHour;
        this.listAllAvaibalityUpdate[0].id = id;
        this.listAllAvaibalityUpdate[0].index = index;
      } else {
        for (let i = 0; i < this.listAllAvaibalityUpdate.length; i++) {
          if (this.listAllAvaibalityUpdate[i].index == index) {
            this.listAllAvaibalityUpdate[i].startHour = startHour;
            this.listAllAvaibalityUpdate[i].id = id;
            this.listAllAvaibalityUpdate[i].index = -1;
            return;
          }
        }
        this.listAllAvaibalityUpdate.push({day: '', id: id, startHour: startHour, endHour: -1, index: -1});
      }
    }
  }

  onChangeHourEnd($event: any, index: number, id: number) {
    if ($event.target.value == '') {
      return;
    }
    let endHour = $event.target.value;
    if (this.modificationAvaibalityBool && index != -1) {
      if (this.listAllAvaibalityUpdate[0].day == "" && this.listAllAvaibalityUpdate[0].endHour == -1) {
        this.listAllAvaibalityUpdate[0].endHour = endHour;
        this.listAllAvaibalityUpdate[0].index = index;
        this.listAllAvaibalityUpdate[0].id = id;
      } else {
        for (let i = 0; i < this.listAllAvaibalityUpdate.length; i++) {
          if (this.listAllAvaibalityUpdate[i].index == index) {
            this.listAllAvaibalityUpdate[i].endHour = endHour;
            this.listAllAvaibalityUpdate[i].id = id;
            this.listAllAvaibalityUpdate[i].index = index;
            return;
          }
        }
        this.listAllAvaibalityUpdate.push({day: '', id: id, startHour: -1, endHour: endHour, index: index});
      }
    }
    if (this.addAvaibalityBool && index == -1) {
      if (this.listAllAvaibalityUpdate[0].day == "") {
        this.listAllAvaibalityUpdate[0].endHour = endHour;
        this.listAllAvaibalityUpdate[0].id = id;
        this.listAllAvaibalityUpdate[0].index = index;
      } else {
        for (let i = 0; i < this.listAllAvaibalityUpdate.length; i++) {
          if (this.listAllAvaibalityUpdate[i].index == index) {
            this.listAllAvaibalityUpdate[i].endHour = endHour;
            this.listAllAvaibalityUpdate[i].id = id;
            this.listAllAvaibalityUpdate[i].index = -1;
            return;
          }
        }
        this.listAllAvaibalityUpdate.push({day: '', id: id, endHour: endHour, startHour: -1, index: -1});
      }
    }
  }

  insertAvaibality() {
    if (this.addAvaibalityBool) {
      if (!this.listAllDay.includes(this.listAllAvaibalityUpdate[0].day)) {
        this.errorMessage = "Veuillez choisir un jour";
        this.returnError = true;
        return;
      } else if (this.listAllAvaibalityUpdate[0].day.length == 0) {
        this.errorMessage = "Veuillez choisir un jour";
        this.returnError = true;
        return;
      } else if (parseInt(String(this.listAllAvaibalityUpdate[0].endHour)) < parseInt(String(this.listAllAvaibalityUpdate[0].startHour))) {
        this.errorMessage = "L'heure de fin doit être supérieure à l'heure de début";
        this.returnError = true;
        return;
      }

      if (this.countInArrayAvaibality(this.listAllAvaibality, this.listAllAvaibalityUpdate[0].day) > 1) {
        this.errorMessage = "Vous avez déjà une disponibilité pour ce jour";
        this.returnError = true;
        return;
      }

      let avaibality = {
        idUser: this.userId,
        day: this.listAllAvaibalityUpdate[0].day,
        startHour: this.listAllAvaibalityUpdate[0].startHour,
        endHour: this.listAllAvaibalityUpdate[0].endHour,
        idPost: null
      };
      this.availableService.insertAvailability(avaibality).subscribe(
        (data: any) => {
          //navigate to the next page
          if (data.response) {
            this.modificationAvaibalityBool = false;
            this.addAvaibalityBool = false;
          } else {
            this.returnError = true;
            this.errorMessage = data.message;
          }
          this.listAllAvaibalityUpdate = [{day: '', id: -1, endHour: -1, startHour: -1, index: 0}];
        }, (error: any) => {
          this.listAllAvaibalityUpdate = [{day: '', id: -1, endHour: -1, startHour: -1, index: 0}];
          this.returnError = true;
          this.errorMessage = "Une erreur est survenue " + error;
        });
    }
  }

  displayComment() {
    this.displayCommentBool = !this.displayCommentBool;
  }


  insertComment(value: string) {
    if (this.currentRate == 0) {
      this.returnError = true;
      this.errorMessage = "Veuillez donner une note";
      return;
    }
    if (value.length == 0) {
      this.returnError = true;
      this.errorMessage = "Veuillez donner un commentaire";
      return;
    }
    for (let i = 0; i < this.listAllComments.length; i++) {
      if (this.listAllComments[i].idUserComment == this.idToken) {
        this.returnError = true;
        this.errorMessage = "Vous avez déjà donné un commentaire";
        return;
      }
    }
    let comment = {
      idProfile: this.userId,
      date: new Date(),
      content: value,
      note: this.currentRate
    }
    this.availableService.insertComment(comment).subscribe(
      (data: any) => {
        //navigate to the next page
        if (data.response) {
          this.displayCommentBool = false;
        } else {
          this.returnError = true;
          this.errorMessage = data.message;
        }
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Une erreur est survenue " + error;
      }, () => {
        this.getAllComments()
      });
  }

  private async getAllComments() {
    this.listAllComments = [];
    this.availableService.getAllComments(this.userId).subscribe(
      (data: any) => {
        if (data.response) {
          this.listAllComments = data.response;
        } else {
          this.returnError = true;
          this.errorMessage = data.message;
        }
      }, (error: any) => {

      }, () => {
        this.noComment = this.listAllComments.length == 0;

        for (let i = 0; i < this.listAllComments.length; i++) {
          this.getUserById(this.listAllComments[i].idUserComment);
        }
      }
    );
  }

  getUserById(id: number): any {
    this.authService.getUserById(id).then(
      (data: any) => {
        if (data.response) {
          for (let i = 0; i < this.listAllComments.length; i++) {
            if (this.listAllComments[i].idUserComment == id) {
              this.listAllComments[i].login = data.response[0].login;
              this.listAllComments[i].photo = data.response[0].photo;
            }
          }
        } else {
          this.returnError = true;
          this.errorMessage = data.message;
        }
      }
    );
  }

  moveToProfil(login: string) {
    this.router.navigate(['/profile'], {queryParams: {login: login}});
  }

  displayAllComment() {
    this.displayMoreComment = !this.displayMoreComment;
  }


  updateAvailability() {
    this.updateAvaibality.idUser = this.userId;
    this.updateAvaibality.arrayAvaibality = this.availabilityTest;
    this.availableService.updateAvailabilityBabysitter(this.updateAvaibality).subscribe(
      (data: any) => {
        //navigate to the next page
        if (data) {
          this.returnSucces = true;
          this.errorMessage = "Votre disponibilité a été mise à jour";
          this.displayAgenda()
        } else {
          console.log("error")
        }
      });
  }

  addItem($event: string[][]) {
    this.availabilityTest = $event;
  }

  displaySignalement() {
    this.displaySignalementBool = !this.displaySignalementBool;
  }

  createSignalement(value: string) {
    if (value.length == 0) {
      this.returnError = true;
      this.errorMessage = "Veuillez donner un commentaire";
      return;
    }
    let signalement = {
      idProfile: this.userId,
      dateTime: new Date(),
      idSignaler: this.idToken,
      reason: value
    }
    this.availableService.createSignalement(signalement).subscribe(
      (data: any) => {
        if (data.response) {
          this.displaySignalementBool = false;
        } else {
          this.returnError = true;
          this.errorMessage = data.message;
        }
      })
  }

  displayCertified(idSkill: number) {
    this.displayCertifiedBool = !this.displayCertifiedBool;
    this.skillId = idSkill;
  }

  createCertified(lastname: string, pass: string) {
    this.loading = true;
    let certified = {
      userName: lastname[0].toUpperCase() + lastname.slice(1),
      idDiplome: pass,
    }
    this.availableService.createCertified(certified, this.skillId).subscribe(
      async (data: any) => {
        this.loading = false;
        if (data.response) {
          await this.initSkills();
          await this.displayCertified(this.skillId);
          this.returnSucces = true;
          this.errorMessage = "Certification du diplome validée";
        } else {
          this.returnError = true;
          this.errorMessage = "Erreure avec la certification du diplome";
        }
      }, (error: any) => {
        this.returnError = true;
        this.errorMessage = "Erreure avec la certification du diplome";
        this.loading = false;
      })
  }

  private async initPosts() {
    //get post by userid
    this.postsService.getPostByIdUser(this.userId).subscribe(
      async (data: any) => {
        if (data.response) {
          this.listPosts = data.response;
          console.log(this.listPosts.length)
          if (this.listPosts.length == 0) {
            this.noPost = true;
          } else {
            this.noPost = false;
            await this.addActivityZoneByPost();
            await this.addSkillByUser();
            await this.addAvaibalityPosts();
          }
        } else {
          this.noPost = true;
        }
      }, (error: any) => {
        this.noPost = true;
      });
  }

  addActivityZoneByPost() {

    //get acitvity zone by post
    for (let post of this.listPosts) {
      if (post.type == 'babysitter') {
        this.postsService.getActivityZoneByPost(post.id).subscribe(
          (data: any) => {
            post.activityZone = [];
            for (let activityZone of data.response) {
              post.activityZone.push(activityZone.codeDep);
            }
          });
      }
    }

  }

  addSkillByUser() {
    //get acitvity zone by post
    for (let post of this.listPosts) {
      if (post.type == 'parent') {
        this.authService.getSkillsByUserId(post.id).then(
          (data: any) => {
            post.skils = [];
            for (let skill of data.response) {
              post.skils.push(skill.name);
            }
          });
      }
    }

  }

  private async addAvaibalityPosts() {
    //get acitvity zone by post
    for (let post of this.listPosts) {
      if (post.type == 'parent') {
        this.availableService.getByPostId(post.id).subscribe(
          (data: any) => {
            post.avaibality = [];
            for (let avaibality of data.response) {
              if (!post.avaibality.includes(avaibality.day)) {
                post.avaibality.push(avaibality.day);
              }
            }
          });
      }
    }
  }

  updatePosts(id: number | null, hourlyWage: string, description: string) {
    this.displayUpdatePost = !this.displayUpdatePost;
    if (id == null) {
      if (hourlyWage.length == 0) {
        this.returnError = true;
        this.errorMessage = "Veuillez donner un tarif horaire";
        return;
      }
      if (description.length == 0) {
        this.returnError = true;
        this.errorMessage = "Veuillez donner une description";
        return;
      }
      if (hourlyWage.length > 0 && description.length > 0) {
        if (parseInt(hourlyWage) <= 0) {
          this.returnError = true;
          this.errorMessage = "Veuillez donner un tarif horaire valide";
          return;
        }
        let post = {
          idUser: this.userId,
          hourlyWage: hourlyWage,
          description: description,
          idPost: this.idPostUpdate
        }
        this.postsService.updatePost(post).subscribe(
          (data: any) => {
            if (data.response) {
              this.displayUpdatePost = false;
              this.initPosts();
              this.returnSucces = true;
              this.errorMessage = "Post modifié";
            } else {
              this.returnError = true;
              this.errorMessage = data.message;
            }
          });
      }
      return;
    }
    this.idPostUpdate = id;
  }

  async banUser(id: number) {
    await this.adminService.banUser(id).subscribe(
      (data: any) => {
        this.ngOnInit();
      }, (error: any) => {
      }
    );
  }
  async unBanUser(id: number) {
    await this.adminService.unBanUser(id).subscribe(
      (data: any) => {
        this.ngOnInit();
      }, (error: any) => {
      }
    );
  }

  private async initBanUser() {
    await this.adminService.getUserBanById(this.userId).subscribe(
      (data: any) => {
        console.log(data["user"])
        this.userBan = data["user"];
      }, (error: any) => {
      }
    );
  }
}
