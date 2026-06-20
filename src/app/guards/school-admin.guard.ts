import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({ providedIn: 'root' })
export class SchoolAdminGuard implements CanActivate {
  constructor(private login: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (!this.login.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    const role = this.login.getUserRole();
    if (role === 'SCHOOL_ADMIN' || role === 'SUPER_ADMIN') return true;
    this.router.navigate(['/']);
    return false;
  }
}
