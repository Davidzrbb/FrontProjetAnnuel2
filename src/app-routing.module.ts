import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConnexionUserComponent} from "./app/connexion-user/connexion-user.component";
import {SubscribeUserComponent} from "./app/subscribe-user/subscribe-user.component";
import {
  FirstConnectionBabysitterComponent
} from "./app/first-connection-babysitter/first-connection-babysitter.component";
import {AuthGuard} from "./app/auth.guard";
import {ProfileComponent} from "./app/profile/profile.component";
import {MessageComponent} from "./app/message/message.component";
import {CalendarComponent} from "./app/calendar/calendar.component";
import {HomeComponent} from "./app/home/home.component";
import {ContractComponent} from "./app/contract/contract.component";
import {HtmlContractComponent} from "./app/html-contract/html-contract.component";
import {QrcodeConnexionComponent} from "./app/qrcode-connexion/qrcode-connexion.component";
import {PostsComponent} from "./app/posts/posts.component";
import {AdminComponent} from "./app/admin/admin.component";
import {AdminSignalementComponent} from "./app/admin-signalement/admin-signalement.component";
import {AdminSignalementProfileComponent} from "./app/admin-signalement-profile/admin-signalement-profile.component";
import {AdminUsersComponent} from "./app/admin-users/admin-users.component";


const routes: Routes = [
  {path: 'login', component: ConnexionUserComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'subscribe', component: SubscribeUserComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'first-connection-babysitter', component: FirstConnectionBabysitterComponent, canActivate: [AuthGuard]},
  {path: 'message', component: MessageComponent, canActivate: [AuthGuard]},
  {path: 'contrat', component: ContractComponent, canActivate: [AuthGuard]},
  {path: 'html-contract', component: HtmlContractComponent, canActivate: [AuthGuard]},
  {path: 'posts', component: PostsComponent, canActivate: [AuthGuard]},
  {path: 'calendar', component: CalendarComponent},
  {path: 'qrcode-connexion', component: QrcodeConnexionComponent},
  {path: 'home', component: HomeComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: 'admin/signalements', component: AdminSignalementComponent, canActivate: [AuthGuard]},
  {path: 'admin/signalements/profile', component: AdminSignalementProfileComponent, canActivate: [AuthGuard]},
  {path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
