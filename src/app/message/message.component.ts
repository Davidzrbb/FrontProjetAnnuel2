import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ConnexionService} from "../services/connexion.service";
import {UserSubscribe} from "../models/UserSubscribe";
import {MessageService} from "../services/message.service";
import {Message} from "../models/Message";
import {debounceTime, distinctUntilChanged, map, Observable, OperatorFunction} from "rxjs";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  public loginParam: string = "";
  public userIdByLogin: number;
  public userIdByToken: number;
  public user: UserSubscribe = new UserSubscribe('', '', '', '', '', 0, 0, '');
  public pictureProfile: string = "../assets/avatar.png";
  public roleId: number;
  public errorMessage: string = "";
  public returnError = false;
  public loading: boolean = false;
  message: Message = new Message();
  public messageArr: Array<any> = [];
  public newMessage: string;
  public sendMessageBool: boolean = false;
  public idSession: string = "";
  public loginOther: Array<any> = [];
  public login: [string] = [""];
  public inboxBool: boolean = false;
  public roleToken: string;

  constructor(private authService: ConnexionService, private route: ActivatedRoute, private router: Router, private messageService: MessageService) {
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) => term.length < 2 ? []
        : this.login.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )


  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.loading = true;
      if (!params['login'] && !params['inbox']) {
        await this.router.navigate(['/login']);
        return;
      }
      if (params['login']) {
        this.inboxBool = false;
        this.loginParam = params['login'];
        await this.initUserByLogin();
        await this.initUserByToken();
        await this.isMessageExist();
        await this.getAllMessage();
        await this.getAllSession();
        await this.getAllUsers();
      }
      if (params['inbox']) {
        this.inboxBool = true;
        await this.initUserByToken();
        await this.getAllSession();
        await this.getAllUsers();
      }
      this.loading = false;
    });
    this.getMessage();
  }

  private async initUserByLogin() {
    let userService = await this.authService.getUserByLogin(this.loginParam);
    if (userService) {
      for (let i = 0; i < Object.keys(userService).length; i++) {
        if (Object.keys(userService)[i] == "id") {
          this.userIdByLogin = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'login') {
          this.user.login = Object.values(userService)[i];
        }
        if (Object.keys(userService)[i] == 'photo') {
          if (Object.values(userService)[i] === null) {
            this.pictureProfile = "../assets/avatar.png";
          } else {
            this.pictureProfile = Object.values(userService)[i];
          }
        }
        if (Object.keys(userService)[i] == 'id_role') {
          this.roleId = Object.values(userService)[i];
        }
      }
      this.user.role =  await this.initRole(this.userIdByLogin);
    } else {
      await this.router.navigate(['/login']);
      return;
    }
  }

  private async initRole(idUser: number) {
    let role = await this.authService.getRoleByToken(idUser);
    console.log(idUser)
    if (role) {
      return Object.values(role)[0]['role'];
    } else {
      this.user.role = "";
      this.errorMessage = "Veuillez vous reconnecter";
      this.returnError = true;
    }
  }

  private async isMessageExist() {
    await this.messageService.isMessageExist(this.userIdByLogin, this.userIdByToken).subscribe(
      async (exist) => {
        if (exist) {
          //connection Session
          this.idSession = exist;
          await this.messageService.joinRoom(this.idSession);
        } else {
          let messageSession = {idUser1: this.userIdByLogin, idUser2: this.userIdByToken};
          await this.messageService.createSessionMessage(messageSession).subscribe(
            async (session) => {
              if (session) {
                //connection Session
                this.idSession = session;
                await this.messageService.joinRoom(this.idSession);
              } else {
                this.errorMessage = "Erreur creation de la session";
                this.returnError = true;
              }
            });
        }
      }
    )
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
    this.roleToken =  await this.initRole(this.userIdByToken);
  }

  private async getAllMessage() {
    this.messageArr = [];
    this.messageService.getMessage(this.userIdByLogin, this.userIdByToken).subscribe(
      res => {
        for (let i = 0; i < res.messageList.length; i++) {
          let items = {
            message: res.messageList[i].valueMessage,
            userId: res.messageList[i].idUser,
            time: res.messageList[i].date
          }
          this.messageArr.push(items)
        }
      },
      (error: any) => {
        this.returnError = true;
        this.errorMessage = Array.of(error)[0].status + ' ' + Array.of(error)[0].statusText
      });
  }

  sendMessage() {
    if (this.userIdByToken && this.newMessage) {
      this.sendMessageBool = true;
      this.messageService.sendMessage(this.newMessage, this.userIdByToken, this.idSession);
    }
    this.newMessage = '';
  }

  getMessage() {
    this.messageService.getNewMessage().subscribe((data: any) => {
      let items = {message: data.message, userId: data.idUser, time: new Date().getTime()}
      if (items.userId !== undefined && items.message !== undefined) {
        this.message.messageValue = items.message;
        this.message.userId = items.userId;
        this.message.date = items.time;
        this.message.userId1 = this.userIdByLogin;
        this.message.userId2 = this.userIdByToken;
        this.messageArr.push(items)
        this.saveMessage();
      }
    })
  }

  private saveMessage() {
    if (this.sendMessageBool) {
      this.sendMessageBool = false;
      this.messageService.saveMessage(this.message).subscribe(
        res => {
        },
        error => {
          this.returnError = true;
          this.errorMessage = Array.of(error)[0].status + ' ' + Array.of(error)[0].statusText
        });
    }
  }

  getAllSession() {
    this.loginOther = [];
    this.messageService.getAllMessagesByIdUser(this.userIdByToken.toString()).subscribe(
      async res => {
        for (let i = 0; i < res.length; i++) {
          if (res[i]["idUser1"] != this.userIdByToken) {
            let login = await this.authService.getRoleByToken(res[i]["idUser1"]);
            if (login) {
              this.loginOther.push(Object.values(login)[0]['login']);
            }
          } else {
            let login = await this.authService.getRoleByToken(res[i]["idUser2"]);
            if (login) {
              this.loginOther.push(Object.values(login)[0]['login']);
            }
          }
        }
      }
    )
  }

  private async getAllUsers() {
    this.login = [""];
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

  moveSession(login: string) {
    if (this.login.includes(login)) {
      this.router.navigate(['/message'], {queryParams: {login: login}});
    } else {
      this.returnError = true;
      this.errorMessage = "Veuillez entrer un utilisateur existant";
    }
  }


  moveToProfil(login: string) {
    this.router.navigate(['/profile'], {queryParams: {login: login}});
  }

  closeAlert() {
    this.returnError = false;
  }
}

