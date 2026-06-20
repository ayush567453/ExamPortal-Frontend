import { Component, OnInit } from '@angular/core';
import { SchoolAdminService } from 'src/app/services/school-admin.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  teachers: any[] = [];
  filtered: any[] = [];
  search = '';
  loading = true;
  showForm = false;
  editingId: string | null = null;

  form = { fullName: '', username: '', email: '', password: '', subject: '', qualification: '' };

  tenantId = '';

  constructor(private schoolService: SchoolAdminService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.tenantId = this.loginService.getTenantId();
    this.load();
  }

  load(): void {
    this.loading = true;
    this.schoolService.getTeachers(this.tenantId).subscribe({
      next: (data) => { this.teachers = this.filtered = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filterTeachers(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.teachers.filter(t =>
      t.fullName?.toLowerCase().includes(q) ||
      t.username?.toLowerCase().includes(q) ||
      t.teacherCode?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q)
    );
  }

  openAdd(): void {
    this.editingId = null;
    this.form = { fullName: '', username: '', email: '', password: '', subject: '', qualification: '' };
    this.showForm = true;
  }

  openEdit(t: any): void {
    this.editingId = t.id;
    this.form = { fullName: t.fullName, username: t.username, email: t.email, password: '', subject: t.subject, qualification: t.qualification };
    this.showForm = true;
  }

  save(): void {
    if (!this.form.fullName || !this.form.username) {
      Swal.fire('Validation', 'Full name and username are required.', 'warning');
      return;
    }
    const req = this.editingId
      ? this.schoolService.updateTeacher(this.tenantId, this.editingId, this.form)
      : this.schoolService.addTeacher(this.tenantId, this.form);

    req.subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: (err) => Swal.fire('Error', err?.error?.message || 'Operation failed', 'error')
    });
  }

  delete(t: any): void {
    Swal.fire({ title: 'Delete Teacher?', text: `Remove ${t.fullName}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' })
      .then(r => {
        if (r.isConfirmed) {
          this.schoolService.deleteTeacher(this.tenantId, t.id).subscribe({
            next: () => this.load(),
            error: () => Swal.fire('Error', 'Could not delete teacher', 'error')
          });
        }
      });
  }
}
