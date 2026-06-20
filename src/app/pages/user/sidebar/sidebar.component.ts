import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  categories: any[] = [];

  constructor(
    private _cat: CategoryService,
    private _snack: MatSnackBar,
    private login: LoginService
  ) {}

  ngOnInit(): void {
    const role = this.login.getUserRole();
    const tenantId = this.login.getTenantId();

    // Students and School Admins see only their school's categories
    if (tenantId && (role === 'STUDENT' || role === 'SCHOOL_ADMIN' || role === 'TEACHER')) {
      this._cat.categoriesByTenant(tenantId).subscribe({
        next: (data: any) => { this.categories = data; },
        error: () => this._snack.open('Error loading categories', '', { duration: 3000 })
      });
    } else {
      this._cat.categories().subscribe({
        next: (data: any) => { this.categories = data; },
        error: () => this._snack.open('Error loading categories', '', { duration: 3000 })
      });
    }
  }
}
