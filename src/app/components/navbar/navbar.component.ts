<<<<<<< HEAD
import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import baseUrl from 'src/app/services/helper';
=======
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
<<<<<<< HEAD
  user: any = null;
  role = '';
  schoolName = '';
  schoolLogoUrl = '';
  scrolled = false;
  menuOpen = false;
  userDropOpen = false;

  constructor(public login: LoginService, private http: HttpClient) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 60;
  }

  ngOnInit(): void {
    this.refresh();
    this.login.loginStatusSubject.asObservable().subscribe(() => this.refresh());
  }

  refresh(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.role = this.login.getUserRole() || '';

    const tenantId = this.login.getTenantId();
    if (tenantId && (this.role === 'SCHOOL_ADMIN' || this.role === 'STUDENT' || this.role === 'TEACHER')) {
      this.http.get<any>(`${baseUrl}/public/school/${tenantId}`).subscribe({
        next: (info) => {
          this.schoolName = info.schoolName || '';
          this.schoolLogoUrl = info.logoUrl ? `${baseUrl}/logos/${info.logoUrl}` : '';
        },
        error: () => {},
      });
    } else {
      this.schoolName = '';
      this.schoolLogoUrl = '';
    }
  }

  get dashboardLink(): string {
    if (this.role === 'SUPER_ADMIN') return '/super-admin/dashboard';
    if (this.role === 'SCHOOL_ADMIN') return '/school-admin/dashboard';
    if (this.role === 'ADMIN') return '/admin';
    return '/user-dashboard/0';
  }

  closeMenus(): void {
    this.menuOpen = false;
    this.userDropOpen = false;
  }

  @HostListener('document:click')
  onDocClick(): void {
    this.userDropOpen = false;
  }

  get roleIcon(): string {
    if (this.role === 'SUPER_ADMIN') return '🛡️';
    if (this.role === 'SCHOOL_ADMIN') return '🏫';
    if (this.role === 'ADMIN') return '⚙️';
    if (this.role === 'TEACHER') return '👨‍🏫';
    return '🎓';
  }

  get roleLabel(): string {
    if (this.role === 'SUPER_ADMIN') return 'Super Admin';
    if (this.role === 'SCHOOL_ADMIN') return 'School Admin';
    if (this.role === 'ADMIN') return 'Admin';
    if (this.role === 'TEACHER') return 'Teacher';
    if (this.role === 'STUDENT') return 'Student';
    return this.role;
  }

  get userInitial(): string {
    return (this.user?.username || this.user?.name || '?')[0].toUpperCase();
=======
  user = null;

  constructor(public login: LoginService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubject.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
  }

  public logout() {
    this.login.logout();
    window.location.reload();
<<<<<<< HEAD
=======
    // this.login.loginStatusSubject.next(false);
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
  }
}
