import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from 'src/app/services/tenant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.css']
})
export class TenantFormComponent implements OnInit {
  isEdit = false;
  tenantId: string | null = null;
  saving = false;
  logoPreview: string | null = null;
  logoFile: File | null = null;

  form = {
    schoolName: '',
    tenantCode: '',
    address: '',
    contactNumber: '',
    email: '',
    adminUsername: '',
    adminEmail: '',
    adminPassword: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.tenantId = this.route.snapshot.paramMap.get('id');
    if (this.tenantId) {
      this.isEdit = true;
      this.tenantService.getTenant(this.tenantId).subscribe({
        next: (t) => {
          this.form.schoolName = t.schoolName;
          this.form.tenantCode = t.tenantCode;
          this.form.address = t.address;
          this.form.contactNumber = t.contactNumber;
          this.form.email = t.email;
          this.form.adminUsername = t.adminUsername;
          this.form.adminEmail = t.adminEmail;
          if (t.logoUrl) this.logoPreview = 'http://localhost:8080/logos/' + t.logoUrl;
        }
      });
    }
  }

  onLogoChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => { this.logoPreview = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  submit(): void {
    if (!this.form.schoolName || !this.form.tenantCode || !this.form.email) {
      Swal.fire('Validation', 'School Name, Code, and Email are required.', 'warning');
      return;
    }
    if (!this.isEdit && !this.form.adminUsername) {
      Swal.fire('Validation', 'Admin username is required for new school.', 'warning');
      return;
    }

    this.saving = true;
    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => fd.append(k, v));
    if (this.logoFile) fd.append('logo', this.logoFile);

    const req = this.isEdit
      ? this.tenantService.updateTenant(this.tenantId!, fd)
      : this.tenantService.createTenant(fd);

    req.subscribe({
      next: () => {
        this.saving = false;
        Swal.fire('Success', this.isEdit ? 'School updated!' : 'School created!', 'success')
          .then(() => this.router.navigate(['/super-admin/tenants']));
      },
      error: (err) => {
        this.saving = false;
        const msg = err?.error?.error || err?.error?.message || err?.message || 'Operation failed';
        Swal.fire('Error', msg, 'error');
      }
    });
  }
}
