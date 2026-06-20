import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
<<<<<<< HEAD
import { LoginService } from 'src/app/services/login.service';
=======
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
<<<<<<< HEAD
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
=======
  categories;
  constructor(private _cat: CategoryService, private _snack: MatSnackBar) {}

  ngOnInit(): void {
    this._cat.categories().subscribe(
      (data: any) => {
        this.categories = data;
      },
      (error) => {
        this._snack.open('Error in loading categories from server', '', {
          duration: 3000,
        });
      }
    );
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
  }
}
