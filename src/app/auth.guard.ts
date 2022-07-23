import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {ConnexionService} from "./services/connexion.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  loader$ = new Subject<boolean>();
  public loader = false;

  constructor(
    private authService: ConnexionService,
    private router: Router
  ) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.loader$.next(true);
    return this.authenticate();
  }

  private async authenticate(): Promise<boolean> {
    let user = await this.authService.isUserLoggedIn();
    if (!user) {
      this.router.navigateByUrl("/login");
      this.loader$.next(false);
      return false;
    } else {
      this.loader$.next(false);
      return true;
    }
  }
}
