import { Component, OnInit } from '@angular/core';
import { SchoolAdminService } from 'src/app/services/school-admin.service';
import { LoginService } from 'src/app/services/login.service';
import { forkJoin } from 'rxjs';

type PayStatus = 'paid' | 'pending';

interface MonthItem { key: string; label: string; }

interface StudentRow {
  id: string;
  name: string;
  classKey: string;
  className: string;
  section: string;
  rollNo: string;
  payments: { [monthKey: string]: PayStatus };  // monthKey = "Apr", "May" ...
}

interface ClassFee {
  classKey: string;
  label: string;
  monthly: number;
  admission: number;
  exam: number;
  other: number;
}

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {
  tenantId = '';
  tab: 'overview' | 'structure' | 'students' = 'overview';
  currentYear = String(new Date().getFullYear());

  months = [
    { key: 'Apr', label: 'April' },
    { key: 'May', label: 'May' },
    { key: 'Jun', label: 'June' },
    { key: 'Jul', label: 'July' },
    { key: 'Aug', label: 'August' },
    { key: 'Sep', label: 'September' },
    { key: 'Oct', label: 'October' },
    { key: 'Nov', label: 'November' },
    { key: 'Dec', label: 'December' },
    { key: 'Jan', label: 'January' },
    { key: 'Feb', label: 'February' },
    { key: 'Mar', label: 'March' },
  ];

  students: StudentRow[] = [];
  feeStructure: ClassFee[] = [];
  summary: any = {};

  loading = true;
  loadingStudents = false;
  saving = false;
  structureSaved = false;
  markingPay = false;

  filterClass = '';
  filterMonth = '';
  filterStatus = '';
  searchQuery = '';

  payModal: { student: StudentRow; month: MonthItem } | null = null;
  payNote = '';

  classOptions: { key: string; label: string }[] = [];

  readonly defaultClasses = [
    'Nursery','KG-1','KG-2',
    'Class 1','Class 2','Class 3','Class 4','Class 5',
    'Class 6','Class 7','Class 8','Class 9','Class 10',
    'Class 11','Class 12'
  ];

  constructor(
    private schoolSvc: SchoolAdminService,
    private loginSvc: LoginService
  ) {}

  ngOnInit(): void {
    this.tenantId = this.loginSvc.getTenantId();
    this.loadAll();
  }

  // ── Load all data ────────────────────────────────────────────────

  loadAll(): void {
    this.loading = true;
    forkJoin({
      structure: this.schoolSvc.getFeeStructure(this.tenantId),
      payments:  this.schoolSvc.getFeePayments(this.tenantId),
      students:  this.schoolSvc.getStudents(this.tenantId),
      summary:   this.schoolSvc.getFeesSummary(this.tenantId),
    }).subscribe({
      next: ({ structure, payments, students, summary }) => {
        this.buildStructure(structure);
        this.buildStudentRows(students, payments);
        this.summary = summary || {};
        this.loading = false;
      },
      error: () => {
        // Partial load — try individually
        this.loadStructureOnly();
        this.loadStudentsOnly();
        this.loading = false;
      }
    });
  }

  private loadStructureOnly(): void {
    this.schoolSvc.getFeeStructure(this.tenantId).subscribe({
      next: (data) => this.buildStructure(data),
      error: () => this.buildStructure([])
    });
  }

  private loadStudentsOnly(): void {
    this.loadingStudents = true;
    forkJoin({
      students: this.schoolSvc.getStudents(this.tenantId),
      payments: this.schoolSvc.getFeePayments(this.tenantId),
    }).subscribe({
      next: ({ students, payments }) => {
        this.buildStudentRows(students, payments);
        this.loadingStudents = false;
      },
      error: () => {
        this.buildStudentRows([], []);
        this.loadingStudents = false;
      }
    });
  }

  // ── Build helpers ────────────────────────────────────────────────

  private buildStructure(apiData: any[]): void {
    if (apiData && apiData.length) {
      this.feeStructure = apiData.map(f => ({
        classKey:  f.classKey  || f.className || '',
        label:     f.label     || f.classKey  || '',
        monthly:   f.monthly   || 0,
        admission: f.admission || 0,
        exam:      f.exam      || 0,
        other:     f.other     || 0,
      }));
    } else {
      // Default structure when no API data
      this.feeStructure = this.defaultClasses.map(c => ({
        classKey: c, label: c, monthly: 500, admission: 2000, exam: 300, other: 100
      }));
    }
  }

  private buildStudentRows(apiStudents: any[], apiPayments: any[]): void {
    // Build payment map: studentId → { monthKey: status }
    const payMap: { [sid: string]: { [m: string]: PayStatus } } = {};
    (apiPayments || []).forEach((p: any) => {
      const sid = String(p.studentId);
      if (!payMap[sid]) payMap[sid] = {};
      payMap[sid][p.month] = p.status as PayStatus;
    });

    if (!apiStudents || !apiStudents.length) {
      // Demo rows
      apiStudents = [
        { id: '1', fullName: 'Rahul Sharma',  className: 'Class 5',  section: 'A', studentCode: 'S001' },
        { id: '2', fullName: 'Priya Singh',   className: 'Class 5',  section: 'A', studentCode: 'S002' },
        { id: '3', fullName: 'Amit Kumar',    className: 'Class 6',  section: 'B', studentCode: 'S003' },
        { id: '4', fullName: 'Sneha Patel',   className: 'Class 3',  section: 'A', studentCode: 'S004' },
        { id: '5', fullName: 'Rohan Verma',   className: 'Class 3',  section: 'A', studentCode: 'S005' },
        { id: '6', fullName: 'Ananya Gupta',  className: 'Class 8',  section: 'A', studentCode: 'S006' },
        { id: '7', fullName: 'Vijay Yadav',   className: 'Class 10', section: 'B', studentCode: 'S007' },
        { id: '8', fullName: 'Kavya Reddy',   className: 'Class 10', section: 'B', studentCode: 'S008' },
      ];
    }

    this.students = apiStudents.map((s: any) => {
      const sid = String(s.id || s.studentCode);
      return {
        id: sid,
        name: s.fullName || s.name || 'Unknown',
        classKey: s.className || '',
        className: s.className || '',
        section: s.section || '',
        rollNo: s.studentCode || '',
        payments: payMap[sid] || {}
      };
    });

    // Class filter options
    const seen = new Set<string>();
    this.classOptions = [];
    this.students.forEach(s => {
      if (!seen.has(s.classKey)) {
        seen.add(s.classKey);
        this.classOptions.push({ key: s.classKey, label: s.className + (s.section ? ' – ' + s.section : '') });
      }
    });
  }

  // ── Fee Structure ────────────────────────────────────────────────

  saveFeeStructure(): void {
    this.saving = true;
    this.schoolSvc.saveFeeStructure(this.tenantId, this.feeStructure).subscribe({
      next: () => {
        this.saving = false;
        this.structureSaved = true;
        setTimeout(() => this.structureSaved = false, 2500);
        // Reload summary
        this.schoolSvc.getFeesSummary(this.tenantId).subscribe({
          next: (s) => this.summary = s
        });
      },
      error: () => { this.saving = false; alert('Error saving fee structure'); }
    });
  }

  // ── Payment mark ─────────────────────────────────────────────────

  togglePay(student: StudentRow, month: MonthItem): void {
    this.payModal = { student, month };
    this.payNote = '';
  }

  confirmPay(status: PayStatus): void {
    if (!this.payModal || this.markingPay) return;
    this.markingPay = true;

    const { student, month } = this.payModal;
    const fee = this.monthlyFeeFor(student.classKey);

    const payload = {
      tenantId:    this.tenantId,
      studentId:   Number(student.id) || 0,
      studentName: student.name,
      rollNo:      student.rollNo,
      className:   student.className,
      section:     student.section,
      month:       month.key,
      year:        this.currentYear,
      status:      status,
      amount:      fee,
      note:        this.payNote,
    };

    this.schoolSvc.markFeePayment(payload).subscribe({
      next: () => {
        // Update local state immediately
        student.payments[month.key] = status;
        this.markingPay = false;
        this.payModal = null;
        // Refresh summary
        this.schoolSvc.getFeesSummary(this.tenantId).subscribe({ next: (s) => this.summary = s });
      },
      error: () => {
        // Fallback: update local even if API fails
        student.payments[month.key] = status;
        this.markingPay = false;
        this.payModal = null;
      }
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────

  getStatus(student: StudentRow, monthKey: string): PayStatus {
    return student.payments[monthKey] || 'pending';
  }

  monthlyFeeFor(classKey: string): number {
    if (!classKey) return 0;
    // 1. Exact match
    let f = this.feeStructure.find(x => x.classKey === classKey);
    if (f) return f.monthly;
    // 2. "4" → "Class 4"
    f = this.feeStructure.find(x => x.classKey === `Class ${classKey}`);
    if (f) return f.monthly;
    // 3. "Class 4" → "4"
    f = this.feeStructure.find(x => `Class ${x.classKey}` === classKey);
    if (f) return f.monthly;
    // 4. Strip all non-digits and compare numbers ("Class 4" vs "4" → "4" === "4")
    const num = classKey.replace(/\D/g, '');
    if (num) {
      f = this.feeStructure.find(x => x.classKey.replace(/\D/g, '') === num);
      if (f) return f.monthly;
    }
    // 5. Case-insensitive trim
    const lc = classKey.toLowerCase().trim();
    f = this.feeStructure.find(x => x.classKey.toLowerCase().trim() === lc);
    return f ? f.monthly : 500; // fallback ₹500 so amount is never 0
  }

  get filteredStudents(): StudentRow[] {
    let rows = this.students;
    if (this.filterClass) rows = rows.filter(s => s.classKey === this.filterClass);
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      rows = rows.filter(s => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q));
    }
    if (this.filterStatus && this.filterMonth) {
      rows = rows.filter(s => this.getStatus(s, this.filterMonth) === this.filterStatus);
    }
    return rows;
  }

  // Summary getters — use API data when available, fallback to local calc

  get totalCollected(): number {
    return this.summary?.totalCollected ?? this.calcCollected();
  }
  get totalPending(): number {
    return this.summary?.totalPending ?? this.calcPending();
  }
  get totalDue(): number {
    return this.summary?.totalDue ?? (this.calcCollected() + this.calcPending());
  }
  get collectionRate(): number {
    return this.summary?.collectionRate ?? (
      this.totalDue > 0 ? Math.round((this.totalCollected / this.totalDue) * 100) : 0
    );
  }
  get monthWise(): any[] {
    return this.summary?.monthWise ?? [];
  }
  get classSummary(): any[] {
    return this.summary?.classWise ?? this.calcClassWise();
  }

  private calcCollected(): number {
    return this.students.reduce((sum, s) => {
      return sum + this.months.filter(m => this.getStatus(s, m.key) === 'paid').length * this.monthlyFeeFor(s.classKey);
    }, 0);
  }
  private calcPending(): number {
    return this.students.reduce((sum, s) => {
      return sum + this.months.filter(m => this.getStatus(s, m.key) === 'pending').length * this.monthlyFeeFor(s.classKey);
    }, 0);
  }
  private calcClassWise(): { label: string; total: number; collected: number; pending: number; rate: number }[] {
    const map = new Map<string, StudentRow[]>();
    this.students.forEach(s => {
      if (!map.has(s.classKey)) map.set(s.classKey, []);
      map.get(s.classKey)!.push(s);
    });
    const result: any[] = [];
    map.forEach((rows, key) => {
      const collected = rows.reduce((sum, s) =>
        sum + this.months.filter(m => this.getStatus(s, m.key) === 'paid').length * this.monthlyFeeFor(s.classKey), 0);
      const pending = rows.reduce((sum, s) =>
        sum + this.months.filter(m => this.getStatus(s, m.key) === 'pending').length * this.monthlyFeeFor(s.classKey), 0);
      const total = collected + pending;
      result.push({ label: key, className: key, total, collected, pending, rate: total > 0 ? Math.round((collected / total) * 100) : 0 });
    });
    return result;
  }

  pendingStudentsForMonth(monthKey: string): number {
    const mw = this.monthWise.find((m: any) => m.month === monthKey);
    return mw ? mw.pendingStudents : this.students.filter(s => this.getStatus(s, monthKey) === 'pending').length;
  }
  collectedForMonth(monthKey: string): number {
    const mw = this.monthWise.find((m: any) => m.month === monthKey);
    return mw ? mw.collected : this.students.filter(s => this.getStatus(s, monthKey) === 'paid').reduce((sum, s) => sum + this.monthlyFeeFor(s.classKey), 0);
  }
  pendingAmountForMonth(monthKey: string): number {
    const mw = this.monthWise.find((m: any) => m.month === monthKey);
    return mw ? mw.pending : this.students.filter(s => this.getStatus(s, monthKey) === 'pending').reduce((sum, s) => sum + this.monthlyFeeFor(s.classKey), 0);
  }

  pendingCountForStudent(s: StudentRow): number {
    return this.months.filter(m => this.getStatus(s, m.key) === 'pending').length;
  }
  paidCountForStudent(s: StudentRow): number {
    return this.months.filter(m => this.getStatus(s, m.key) === 'paid').length;
  }

  get totalStudents(): number { return this.students.length; }

  fmt(n: number): string {
    return '₹' + (n || 0).toLocaleString('en-IN');
  }
}
