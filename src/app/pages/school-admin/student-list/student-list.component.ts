import { Component, OnInit } from '@angular/core';
import { SchoolAdminService } from 'src/app/services/school-admin.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  filtered: any[] = [];
  search = '';
  loading = true;
  showForm = false;
  editingId: string | null = null;

  form = { fullName: '', username: '', email: '', password: '', className: '', section: '', guardianName: '' };

  tenantId = '';

  constructor(private schoolService: SchoolAdminService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.tenantId = this.loginService.getTenantId();
    this.load();
  }

  load(): void {
    this.loading = true;
    this.schoolService.getStudents(this.tenantId).subscribe({
      next: (data) => { this.students = this.filtered = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filterStudents(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.students.filter(s =>
      s.fullName?.toLowerCase().includes(q) ||
      s.username?.toLowerCase().includes(q) ||
      s.studentCode?.toLowerCase().includes(q) ||
      s.className?.toLowerCase().includes(q)
    );
  }

  openAdd(): void {
    this.editingId = null;
    this.form = { fullName: '', username: '', email: '', password: '', className: '', section: '', guardianName: '' };
    this.showForm = true;
  }

  openEdit(s: any): void {
    this.editingId = s.id;
    this.form = { fullName: s.fullName, username: s.username, email: s.email, password: '', className: s.className, section: s.section, guardianName: s.guardianName };
    this.showForm = true;
  }

  save(): void {
    if (!this.form.fullName || !this.form.username) {
      Swal.fire('Validation', 'Full name and username are required.', 'warning');
      return;
    }
    const req = this.editingId
      ? this.schoolService.updateStudent(this.tenantId, this.editingId, this.form)
      : this.schoolService.addStudent(this.tenantId, this.form);

    req.subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: (err) => Swal.fire('Error', err?.error?.message || 'Operation failed', 'error')
    });
  }

  delete(s: any): void {
    Swal.fire({ title: 'Delete Student?', text: `Remove ${s.fullName}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' })
      .then(r => {
        if (r.isConfirmed) {
          this.schoolService.deleteStudent(this.tenantId, s.id).subscribe({
            next: () => this.load(),
            error: () => Swal.fire('Error', 'Could not delete student', 'error')
          });
        }
      });
  }
}
