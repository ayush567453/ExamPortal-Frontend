import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './helper';

@Injectable({ providedIn: 'root' })
export class TenantService {
  constructor(private http: HttpClient) {}

  getAllTenants(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/super-admin/tenants`);
  }

  getTenant(id: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/super-admin/tenants/${id}`);
  }

  createTenant(formData: FormData): Observable<any> {
    return this.http.post<any>(`${baseUrl}/super-admin/tenants`, formData);
  }

  updateTenant(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/super-admin/tenants/${id}`, data);
  }

  deleteTenant(id: string): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/super-admin/tenants/${id}`);
  }

  activateTenant(id: string): Observable<any> {
    return this.http.patch<any>(`${baseUrl}/super-admin/tenants/${id}/activate`, {});
  }

  deactivateTenant(id: string): Observable<any> {
    return this.http.patch<any>(`${baseUrl}/super-admin/tenants/${id}/deactivate`, {});
  }

  getSuperDashboard(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/super-admin/dashboard`);
  }
}
