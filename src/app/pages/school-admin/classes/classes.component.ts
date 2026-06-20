import { Component, OnInit } from '@angular/core';
import { SchoolAdminService } from 'src/app/services/school-admin.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  tenantId = '';
  classes: any[] = [];
  loading = true;
  showForm = false;
  saving = false;
  deleteConfirmId: number | null = null;

  newClass = { name: '', section: '', description: '', tenantId: '' };

  readonly classColors = [
    '#2563eb','#7c3aed','#059669','#d97706','#dc2626',
    '#0891b2','#be185d','#065f46','#92400e','#1e40af'
  ];

  constructor(
    private schoolService: SchoolAdminService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.tenantId = this.loginService.getTenantId();
    this.load();
  }

  load(): void {
    this.loading = true;
    this.schoolService.getClasses(this.tenantId).subscribe({
      next: (data) => { this.classes = data || []; this.loading = false; },
      error: () => { this.classes = []; this.loading = false; }
    });
  }

  colorFor(i: number): string {
    return this.classColors[i % this.classColors.length];
  }

  openForm(): void {
    this.newClass = { name: '', section: '', description: '', tenantId: this.tenantId };
    this.showForm = true;
  }

  saveClass(): void {
    if (!this.newClass.name.trim()) return;
    this.saving = true;
    this.schoolService.createClass({ ...this.newClass, tenantId: this.tenantId }).subscribe({
      next: () => { this.saving = false; this.showForm = false; this.load(); },
      error: () => { this.saving = false; }
    });
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
  }

  deleteClass(): void {
    if (this.deleteConfirmId == null) return;
    this.schoolService.deleteClass(this.deleteConfirmId).subscribe({
      next: () => { this.deleteConfirmId = null; this.load(); },
      error: () => { this.deleteConfirmId = null; }
    });
  }

  sections = ['A','B','C','D','E'];
  classNames = [
    'Nursery','KG-1','KG-2',
    'Class 1','Class 2','Class 3','Class 4','Class 5',
    'Class 6','Class 7','Class 8','Class 9','Class 10',
    'Class 11','Class 12'
  ];
}
