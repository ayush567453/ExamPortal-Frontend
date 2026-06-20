import { Component, OnInit } from '@angular/core';
import { TenantService } from 'src/app/services/tenant.service';

@Component({
  selector: 'app-super-dashboard',
  templateUrl: './super-dashboard.component.html',
  styleUrls: ['./super-dashboard.component.css']
})
export class SuperDashboardComponent implements OnInit {
  stats: any = {};
  loading = true;

  constructor(private tenantService: TenantService) {}

  ngOnInit(): void {
    this.tenantService.getSuperDashboard().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
