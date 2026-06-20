import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { LoginService } from 'src/app/services/login.service';
=======
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.css'],
})
export class ViewCategoriesComponent implements OnInit {
<<<<<<< HEAD
  categories: any[] = [];
  loading = true;
  role = '';
  tenantId = '';

  constructor(
    private _category: CategoryService,
    private _login: LoginService
  ) {}

  ngOnInit(): void {
    this.role = this._login.getUserRole() || '';
    this.tenantId = this._login.getTenantId();

    const load$ =
      this.role === 'SCHOOL_ADMIN' && this.tenantId
        ? this._category.categoriesByTenant(this.tenantId)
        : this._category.categories();

    load$.subscribe({
      next: (data: any) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Could not load categories', 'error');
      },
    });
=======
  categories = [];

  constructor(private _category: CategoryService) {}

  ngOnInit(): void {
    this._category.categories().subscribe(
      (data: any) => {
        //css
        this.categories = data;
        console.log(this.categories);
      },

      (error) => {
        //
        console.log(error);
        Swal.fire('Error !!', 'Error in loading data', 'error');
      }
    );
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
  }
}
