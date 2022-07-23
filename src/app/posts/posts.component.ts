import {Component, OnInit} from '@angular/core';
import {ConnexionService} from "../services/connexion.service";
import {SubscribeService} from "../services/subscribe-service";
import {ActivatedRoute, Router} from "@angular/router";
import {AvailabilityService} from "../services/availability.service";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";


import codesPostaux from "codes-postaux";
import {PostsService} from "../services/posts.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  public displayCreatePostsBool = false;
  public displaySearchPostsBool = false;
  public loading: boolean = false;
  public idUser: number;
  public userRole: string;
  public listCommuneSelect: string[] = [];
  public listDaysSelect: string[] = [];
  public listCategorySelect: string[] = [];
  public errorMessage: string = "";
  public returnError = false;

  public nextStepCreatePostsBool: boolean = false;
  private postsSave: { codeDep: string[]; cityCode: number | null; hourlyWage: any; description: string; numberChild: number | null; availability: null | string[][]; ageChild: null, listSkill: string[] | null };
  public listAllCategories: string[] = [];
  public listAllSkill: string[] = [];
  public listPosts: any = [];
  public listAllPosts: any = [];
  public post: any = {};
  search: boolean = false;
  public roleFiler: string = "null";
  public hourlyWageFiler: string = "null";
  public searchFilter: string = "null";
  public startSeach: boolean = false;
  returnSucces: boolean = false;
  public success : string = "success";


  constructor(private authService: ConnexionService, private updateUserService: SubscribeService, private route: ActivatedRoute,
              private subscribeService: SubscribeService, private router: Router, private postsService: PostsService, private availabilityService: AvailabilityService) {
  }

  async ngOnInit() {
    this.loading = true;
    await this.initUserByToken();
    await this.getAllPost();
    await this.initCategories();
  }

  displayCreatePosts() {
    this.displayCreatePostsBool = !this.displayCreatePostsBool;
    this.listAllSkill = [];
  }

  displaySearchPosts() {
    this.displaySearchPostsBool = !this.displaySearchPostsBool;
    this.listDaysSelect = [];
    this.listCategorySelect = [];
    this.listCommuneSelect = [];
    this.listAllSkill = [];
  }

  savePost(city: string, hourlyWage: string, description: string, numberChild: string) {
    let numberChildInt;
    let cityInt;
    let hourlyWageInt;
    if (hourlyWage == "") {
      this.errorMessage = "Vous devez entrer un salaire horaire";
      this.returnError = true;
      return;
    } else {
      hourlyWageInt = parseInt(hourlyWage);
    }
    if (description == "") {
      this.errorMessage = "Vous devez entrer une description";
      this.returnError = true;
      return;
    }
    if (numberChild == "") {
      numberChildInt = null
    } else {
      if (parseInt(numberChild) > 10 || parseInt(numberChild) < 0) {
        this.errorMessage = "Vous devez entrer un nombre d'enfants entre 0 et 10";
        this.returnError = true;
        return;
      }
      numberChildInt = parseInt(numberChild)
    }
    if (city == "") {
      cityInt = null
    } else {
      if (codesPostaux.find(city).length == 0) {
        this.errorMessage = "Vous devez entrer un code postal valide";
        this.returnError = true;
        return;
      }
      cityInt = parseInt(city)
    }
    this.postsSave = {
      cityCode: cityInt,
      codeDep: this.listCommuneSelect,
      hourlyWage: hourlyWageInt,
      description: description,
      numberChild: numberChildInt,
      availability: null,
      ageChild: null,
      listSkill: this.listAllSkill
    };
    if (this.userRole == 'parent') {
      this.nextStepCreatePostsBool = true;
    } else {
      this.createPosts();
    }
  }

  private async initUserByToken() {
    let userService = await this.authService.isUserLoggedIn();
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (Object.keys(userService)[i] == 'id') {
          this.idUser = Object.values(userService)[i];
        }
      }
    } else {
      await this.router.navigate(['/login']);
      return;
    }
    await this.initRole();
  }

  async initRole() {
    let role = await this.authService.getRoleByToken(this.idUser);
    if (role) {
      this.userRole = Object.values(role)[0]['role'];
    } else {
      await this.router.navigate(['/login']);
      return;
    }
  }

  onChangeSelect($event: any) {
    if (this.listCommuneSelect.length > 5) {
      this.errorMessage = "Vous ne pouvez sélectionner que 5 communes maximum";
      this.returnError = true;
      return;
    }
    if (!this.listCommuneSelect.includes($event.target.value) && $event.target.value != 0) {
      this.listCommuneSelect.push($event.target.value);
    }
  }

  closeAlert() {
    this.errorMessage = "";
    this.returnError = false;
  }

  public createPosts() {
    this.postsService.createPosts(this.postsSave).subscribe(
      (data) => {
        this.nextStepCreatePostsBool = false;
        this.displayCreatePostsBool = false;
        this.displaySearchPostsBool = false;
        this.listCommuneSelect = [];
        this.listAllSkill = [];
        this.returnSucces = true;
        this.errorMessage = "Votre annonce a été créée avec succès";
        this.getAllPost();
      }
    );
  }

  addItem($event: string[][]) {
    this.postsSave.availability = $event;
  }

  onChangeSelectAvaibalitySearch($event: any) {
    if (!this.listDaysSelect.includes($event.target.value) && $event.target.value != 0) {
      this.listDaysSelect.push($event.target.value);
    }
  }

  onChangeSelectCategory($event: any) {
    if (!this.listCategorySelect.includes($event.target.value) && $event.target.value != 0) {
      this.listCategorySelect.push($event.target.value);
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

  onChangeSkills(value: string) {
    if (this.listAllSkill.length > 5) {
      this.errorMessage = "Vous ne pouvez specifier que 5 compétences maximum";
      this.returnError = true;
      return;
    }
    if (!this.listAllSkill.includes(value) && value != "") {
      this.listAllSkill.push(value);
      let input = document.getElementById('skill') as HTMLInputElement | null;
      if (input != null) {
        input.value = "";
      }
      let input1 = document.getElementById('skill1') as HTMLInputElement | null;
      if (input1 != null) {
        input1.value = "";
      }
    }
  }

  searchPost() {
    this.loading = true;
    this.listPosts = [];

    if (this.listDaysSelect.length == 0 || this.listCategorySelect.length == 0 || this.listAllSkill.length == 0 || this.listCommuneSelect.length == 0) {
      this.errorMessage = "Vous devez remplir tous les champs";
      this.returnError = true;
      return;
    }
    this.roleFiler = "null";
    this.hourlyWageFiler = "null";
    this.startSeach = true;

    let search = {
      availability: this.listDaysSelect,
      category: this.listCategorySelect,
      skill: this.listAllSkill,
      activityZone: this.listCommuneSelect
    }

    this.postsService.searchPost(search).subscribe(
      (data1: any) => {
        for (let idPost of data1.response) {
          //get postbyid
          this.postsService.getPostById(idPost).subscribe(
            async (data2: any) => {
              this.post = data2.response;
              this.listPosts.push(this.post);
              if (this.listPosts.length == data1.response.length) {
                if (this.userRole == 'parent') {
                  await this.addActivityZoneByPost();
                  await this.addSkillByUser();
                }
                if (this.userRole == 'babysitter') {
                  await this.addAvaibality();
                }
                await this.addDateUser();
              }
            });
        }
        this.listAllPosts = this.listPosts;
        this.displaySearchPosts();
        this.loading = false;
      }
    );
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

  private async addAvaibality() {
    //get acitvity zone by post
    for (let post of this.listPosts) {
      if (post.type == 'parent') {
        this.availabilityService.getByPostId(post.id).subscribe(
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

  private async addDateUser() {
    //get acitvity zone by post
    for (let post of this.listPosts) {
      this.authService.getUserById(post.idUser).then(
        (data: any) => {
          post.login = data.response[0].login;
          if (data.response[0].photo != null) {
            post.photo = data.response[0].photo;
          } else {
            post.photo = "../../assets/avatar.png";
          }
          this.loading = false;
        });
    }
  }

  private async getAllPost() {
    //get acitvity zone by post
    this.postsService.getAllPost().subscribe(
      async (data: any) => {
        this.listPosts = data.response;
        this.listAllPosts = data.response;
        await this.addActivityZoneByPost();
        await this.addSkillByUser();
        await this.addAvaibality();
        await this.addDateUser();
      }
    );
  }

  onChangeFilter($event: any, type: string) {
    this.listPosts = this.listAllPosts;
    switch (type) {
      case"role":
        this.roleFiler = $event.target.value;
        break;
      case"hourlyWage":
        this.hourlyWageFiler = $event.target.value;
        break;
      case "search":
        this.searchFilter = $event.target.value;
        break;
      case "":
        break;
      default:
        return;
    }

    if (this.roleFiler == "babysitter" && !this.startSeach) {
      this.listPosts = this.listPosts.filter(post => post.type === "babysitter");
    } else if (this.roleFiler == "parent" && !this.startSeach) {
      this.listPosts = this.listPosts.filter(post => post.type === "parent");
    }

    if (this.hourlyWageFiler == "asc") {
      this.listPosts = this.listPosts.sort((a, b) => a.hourlyWage - b.hourlyWage);
    } else if (this.hourlyWageFiler == "desc") {
      this.listPosts = this.listPosts.sort((a, b) => b.hourlyWage - a.hourlyWage);
    }

    if(this.searchFilter === "false" && this.startSeach){
      this.startSeach = false;
      this.getAllPost()
    }

  }
}
