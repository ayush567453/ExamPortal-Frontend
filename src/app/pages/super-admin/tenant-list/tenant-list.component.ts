import { Component, OnInit } from '@angular/core';
import { TenantService } from 'src/app/services/tenant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.css']
})
export class TenantListComponent implements OnInit {
  tenants: any[] = [];
  loading = true;

  constructor(private tenantService: TenantService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.tenantService.getAllTenants().subscribe({
      next: (data) => { this.tenants = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  toggleStatus(t: any): void {
    const action = t.status === 'ACTIVE'
      ? this.tenantService.deactivateTenant(t.tenantId)
      : this.tenantService.activateTenant(t.tenantId);

    action.subscribe({
      next: () => { t.status = t.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'; },
      error: () => Swal.fire('Error', 'Could not update status', 'error')
    });
  }

  delete(t: any): void {
    Swal.fire({
      title: 'Delete School?',
      text: `This will permanently delete "${t.schoolName}" and all its data.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    }).then(result => {
      if (result.isConfirmed) {
        this.tenantService.deleteTenant(t.tenantId).subscribe({
          next: () => { this.tenants = this.tenants.filter(x => x.tenantId !== t.tenantId); },
          error: () => Swal.fire('Error', 'Could not delete school', 'error')
        });
      }
    });
  }
}
