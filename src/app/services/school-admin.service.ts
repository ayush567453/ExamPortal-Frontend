import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from './helper';

@Injectable({ providedIn: 'root' })
export class SchoolAdminService {
  constructor(private http: HttpClient) {}

  getDashboard(tenantId: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/school/dashboard/${tenantId}`);
  }

  getSchoolInfo(tenantId: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/school/info/${tenantId}`);
  }

  // Students
  getStudents(tenantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/school/students/${tenantId}`);
  }
  addStudent(tenantId: string, data: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/school/students`, { ...data, tenantId });
  }
  updateStudent(tenantId: string, id: string, data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/school/students/${id}`, { ...data, tenantId });
  }
  deleteStudent(tenantId: string, id: string): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/school/students/${id}?tenantId=${tenantId}`);
  }

  // Teachers
  getTeachers(tenantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/school/teachers/${tenantId}`);
  }
  addTeacher(tenantId: string, data: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/school/teachers`, { ...data, tenantId });
  }
  updateTeacher(tenantId: string, id: string, data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/school/teachers/${id}`, { ...data, tenantId });
  }
  deleteTeacher(tenantId: string, id: string): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/school/teachers/${id}?tenantId=${tenantId}`);
  }

  // Classes
  getClasses(tenantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/school/classes/${tenantId}`);
  }
  createClass(data: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/school/classes`, data);
  }
  deleteClass(id: number): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/school/classes/${id}`);
  }

  // ── Fees ──────────────────────────────────────────────────────

  /** GET fee structure for all classes of this school */
  getFeeStructure(tenantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/school/fees/structure/${tenantId}`);
  }

  /** POST - save/replace full fee structure */
  saveFeeStructure(tenantId: string, structures: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${baseUrl}/school/fees/structure/${tenantId}`, structures);
  }

  /** GET all payment records for the school */
  getFeePayments(tenantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/school/fees/payments/${tenantId}`);
  }

  /** GET payments for a single student */
  getStudentFeePayments(tenantId: string, studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/school/fees/payments/${tenantId}/student/${studentId}`);
  }

  /** POST - mark a single month as paid/pending */
  markFeePayment(payment: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/school/fees/payments/mark`, payment);
  }

  /** GET aggregated summary (totals, month-wise, class-wise) */
  getFeesSummary(tenantId: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/school/fees/summary/${tenantId}`);
  }
}
