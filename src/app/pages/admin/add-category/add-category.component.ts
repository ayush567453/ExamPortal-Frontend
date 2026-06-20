import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent implements OnInit {
  loading = false;
  role = '';
  tenantId = '';

  category: any = {
    title: '',
    description: '',
  };

  constructor(
    private _category: CategoryService,
    private _login: LoginService
  ) {}

  ngOnInit(): void {
    this.role = this._login.getUserRole() || '';
    this.tenantId = this._login.getTenantId();
    if (this.role === 'SCHOOL_ADMIN' && this.tenantId) {
      this.category.tenantId = this.tenantId;
    }
  }

  formSubmit() {
    if (!this.category.title.trim()) {
      Swal.fire('Validation', 'Category title is required', 'warning');
      return;
    }
    this.loading = true;
    this._category.addCategory(this.category).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Success', 'Category added successfully!', 'success');
        this.category = {
          title: '',
          description: '',
          ...(this.role === 'SCHOOL_ADMIN' ? { tenantId: this.tenantId } : {}),
        };
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Could not add category', 'error');
      },
    });
  }
}
