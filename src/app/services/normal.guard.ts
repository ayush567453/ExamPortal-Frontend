import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class NormalGuard implements CanActivate {
  constructor(private login: LoginService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
<<<<<<< HEAD
    const role = this.login.getUserRole();
    if (this.login.isLoggedIn() && (role === 'NORMAL' || role === 'STUDENT' || role === 'TEACHER')) {
=======
    if (this.login.isLoggedIn() && this.login.getUserRole() == 'NORMAL') {
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}
