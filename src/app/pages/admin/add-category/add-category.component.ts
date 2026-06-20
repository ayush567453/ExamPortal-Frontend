import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { CategoryService } from 'src/app/services/category.service';
import { LoginService } from 'src/app/services/login.service';
=======
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent implements OnInit {
<<<<<<< HEAD
  loading = false;
  role = '';
  tenantId = '';

  category: any = {
=======
  category = {
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
    title: '',
    description: '',
  };

  constructor(
    private _category: CategoryService,
<<<<<<< HEAD
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
=======
    private _snack: MatSnackBar
  ) {}

  ngOnInit(): void {}

  formSubmit() {
    if (this.category.title.trim() == '' || this.category.title == null) {
      this._snack.open('Title Required !!', '', {
        duration: 3000,
      });
      return;
    }

    //all done

    this._category.addCategory(this.category).subscribe(
      (data: any) => {
        this.category.title = '';
        this.category.description = '';
        Swal.fire('Success !!', 'Category is added successfuly', 'success');
      },
      (error) => {
        console.log(error);
        Swal.fire('Error !!', 'Server error !!', 'error');
      }
    );
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
  }
}
