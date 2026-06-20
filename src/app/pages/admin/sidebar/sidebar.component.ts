import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import baseUrl from 'src/app/services/helper';
=======
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
<<<<<<< HEAD
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  role = '';
  tenantId = '';
  schoolName = '';
  schoolLogoUrl = '';
  adminUsername = '';

  adminNavItems = [
    { icon: '🏠', label: 'Home', link: '/admin' },
    { icon: '👤', label: 'Profile', link: '/admin/profile' },
    { icon: '📂', label: 'Categories', link: '/admin/categories' },
    { icon: '➕', label: 'Add Category', link: '/admin/add-category' },
    { icon: '📝', label: 'Quizzes', link: '/admin/quizzes' },
    { icon: '✚', label: 'Add Quiz', link: '/admin/add-quiz' },
    { icon: '✅', label: 'Quiz Result', link: '/admin/quiz-result' },
  ];

  schoolNavItems = [
    { icon: '🏠', label: 'Dashboard', link: '/school-admin/dashboard' },
    { icon: '🎓', label: 'Students', link: '/school-admin/students' },
    { icon: '👨‍🏫', label: 'Teachers', link: '/school-admin/teachers' },
    { icon: '📂', label: 'Categories', link: '/admin/categories' },
    { icon: '➕', label: 'Add Category', link: '/admin/add-category' },
    { icon: '📝', label: 'Quizzes', link: '/admin/quizzes' },
    { icon: '✚', label: 'Add Quiz', link: '/admin/add-quiz' },
    { icon: '✅', label: 'Quiz Results', link: '/admin/quiz-result' },
  ];

  constructor(
    private login: LoginService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.login.getUserRole() || '';
    this.tenantId = this.login.getTenantId();
    const user = this.login.getUser();
    this.adminUsername = user?.username || '';

    if (this.role === 'SCHOOL_ADMIN' && this.tenantId) {
      this.http.get<any>(`${baseUrl}/public/school/${this.tenantId}`).subscribe({
        next: (info) => {
          this.schoolName = info.schoolName || '';
          this.schoolLogoUrl = info.logoUrl
            ? `${baseUrl}/logos/${info.logoUrl}`
            : '';
        },
        error: () => {},
      });
    }
  }

  get navItems() {
    return this.role === 'SCHOOL_ADMIN' ? this.schoolNavItems : this.adminNavItems;
  }

  logout() {
    this.login.logout();
    this.router.navigate(['/login']);
  }
=======
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
  }

>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
}
