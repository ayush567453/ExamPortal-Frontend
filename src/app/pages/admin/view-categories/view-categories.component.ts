import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.css'],
})
export class ViewCategoriesComponent implements OnInit {
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
  }
}
