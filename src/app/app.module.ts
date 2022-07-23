import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {ConnexionUserComponent} from './connexion-user/connexion-user.component';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SubscribeUserComponent} from "./subscribe-user/subscribe-user.component";
import {FirstConnectionBabysitterComponent} from './first-connection-babysitter/first-connection-babysitter.component';
import {ProfileComponent} from './profile/profile.component';
import {NavbarComponent} from './navbar/navbar.component';
import {MessageComponent} from './message/message.component';
import {AuthGuard} from "./auth.guard";
import {CalendarComponent} from './calendar/calendar.component';
import {HomeComponent} from './home/home.component';
import {ContractComponent} from './contract/contract.component';
import {HtmlContractComponent} from "./html-contract/html-contract.component";
import {QRCodeModule} from "angular2-qrcode";
import { QrcodeConnexionComponent } from './qrcode-connexion/qrcode-connexion.component';
import { PostsComponent } from './posts/posts.component';
import { AdminComponent } from './admin/admin.component';
import { AdminSignalementComponent } from './admin-signalement/admin-signalement.component';
import { AdminSignalementProfileComponent } from './admin-signalement-profile/admin-signalement-profile.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [
    AppComponent,
    ConnexionUserComponent,
    SubscribeUserComponent,
    FirstConnectionBabysitterComponent,
    ProfileComponent,
    NavbarComponent,
    MessageComponent,
    CalendarComponent,
    HomeComponent,
    ContractComponent,
    HtmlContractComponent,
    QrcodeConnexionComponent,
    PostsComponent,
    AdminComponent,
    AdminSignalementComponent,
    AdminSignalementProfileComponent,
    AdminUsersComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    QRCodeModule,
    DataTablesModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
