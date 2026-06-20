import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SchoolAdminService } from 'src/app/services/school-admin.service';
import { LoginService } from 'src/app/services/login.service';
import baseUrl from 'src/app/services/helper';

@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  stats: any = {};
  school: any = {};
  loading = true;
  tenantId = '';
  adminName = '';
  sidebarOpen = true;
  currentDate = new Date();

  // Animated counters
  c_students = 0;
  c_teachers = 0;
  c_classes = 0;
  c_exams = 0;

  private counterTimer: any;
  private loadingTimeout: any;
  private observer: IntersectionObserver | null = null;

  navItems = [
    { label: 'Dashboard',  icon: '🏠', route: '/school-admin/dashboard' },
    { label: 'Students',   icon: '🎓', route: '/school-admin/students' },
    { label: 'Teachers',   icon: '👨‍🏫', route: '/school-admin/teachers' },
    { label: 'Classes',    icon: '🚪', route: '/school-admin/classes' },
    { label: 'Timetable',  icon: '📅', route: '/school-admin/timetable' },
    { label: 'Fees',       icon: '💰', route: '/school-admin/fees' },
    { label: 'Exams',      icon: '📝', route: '/admin/quizzes' },
    { label: 'Add Quiz',   icon: '➕', route: '/admin/add-quiz' },
    { label: 'Results',    icon: '📊', route: '/admin/quiz-result' },
    { label: 'Categories', icon: '🗂️', route: '/admin/categories' },
  ];

  // Fees mini-summary from API
  feesCollected = 0;   // ₹ amount
  feesPending = 0;     // ₹ amount
  feesRate = 0;        // %
  feesPaidCount = 0;   // number of paid payment entries
  feesPendingCount = 0;// number of pending payment entries

  private routerSub: any;

  recentActivities = [
    { icon: '🎓', text: 'New student registered', time: '2 min ago', color: '#2563eb' },
    { icon: '📝', text: 'Exam "Math Test" created', time: '1 hr ago', color: '#7c3aed' },
    { icon: '📊', text: 'Results published for Class 5', time: '3 hr ago', color: '#059669' },
    { icon: '👨‍🏫', text: 'Teacher profile updated', time: 'Yesterday', color: '#d97706' },
  ];

  quickStats = [
    { label: 'Attendance Today', value: '87%', icon: '✅', color: '#059669', bg: '#dcfce7' },
    { label: 'Pending Results',  value: '3',   icon: '⏳', color: '#d97706', bg: '#ffedd5' },
    { label: 'This Month Exams', value: '12',  icon: '📋', color: '#7c3aed', bg: '#ede9fe' },
  ];

  constructor(
    private schoolService: SchoolAdminService,
    private loginService: LoginService,
    private http: HttpClient,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.tenantId = this.loginService.getTenantId();
    const user = this.loginService.getUser();
    this.adminName = user?.firstName || user?.username || 'Admin';

    this.http.get<any>(`${baseUrl}/public/school/${this.tenantId}`).subscribe({
      next: (s) => {
        this.school = s;
        this.school.logoFull = s.logoUrl ? `${baseUrl}/logos/${s.logoUrl}` : '';
      }
    });

    // Fallback: if API takes > 4s, stop loading and show zeros
    this.loadingTimeout = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.revealAfterLoad();
      }
    }, 4000);

    this.loadFeesSummary();

    // Re-load fees summary whenever user navigates back to dashboard
    this.routerSub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd && e.urlAfterRedirects === '/school-admin/dashboard') {
        this.loadFeesSummary();
      }
    });

    this.schoolService.getDashboard(this.tenantId).subscribe({
      next: (data) => {
        clearTimeout(this.loadingTimeout);
        this.stats = data || {};
        this.loading = false;
        this.animateCounters();
        this.revealAfterLoad();
      },
      error: () => {
        clearTimeout(this.loadingTimeout);
        this.stats = {};
        this.loading = false;
        this.revealAfterLoad();
      }
    });
  }

  ngAfterViewInit(): void {
    // Static sections that exist from the start (not behind *ngIf)
    this.initScrollReveal();
  }

  private revealAfterLoad(): void {
    // Re-run after *ngIf renders the stat cards into DOM
    setTimeout(() => this.initScrollReveal(), 80);
  }

  private animateCounters(): void {
    const targets = {
      students: this.stats.totalStudents || 0,
      teachers: this.stats.totalTeachers || 0,
      classes:  this.stats.totalClasses  || 0,
      exams:    this.stats.totalExams    || 0,
    };
    const dur = 1200;
    const steps = 40;
    const interval = dur / steps;
    let step = 0;
    this.counterTimer = setInterval(() => {
      step++;
      const p = step / steps;
      const ease = 1 - Math.pow(1 - p, 3);
      this.c_students = Math.round(targets.students * ease);
      this.c_teachers = Math.round(targets.teachers * ease);
      this.c_classes  = Math.round(targets.classes  * ease);
      this.c_exams    = Math.round(targets.exams    * ease);
      if (step >= steps) clearInterval(this.counterTimer);
    }, interval);
  }

  private initScrollReveal(): void {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    if (!els.length) return;
    if (!this.observer) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); } });
      }, { threshold: 0.05 });
    }
    els.forEach(el => this.observer!.observe(el));
  }

  ngOnDestroy(): void {
    if (this.counterTimer) clearInterval(this.counterTimer);
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
    if (this.observer) this.observer.disconnect();
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  private loadFeesSummary(): void {
    // Parallel: summary + raw payments (for count fallback)
    this.schoolService.getFeesSummary(this.tenantId).subscribe({
      next: (data: any) => {
        this.feesCollected = data?.totalCollected || 0;
        this.feesPending   = data?.totalPending   || 0;
        this.feesRate      = data?.collectionRate  || 0;
      },
      error: () => {}
    });

    // Always count entries regardless of ₹ amount (so even ₹0 records show up)
    this.schoolService.getFeePayments(this.tenantId).subscribe({
      next: (payments: any[]) => {
        this.feesPaidCount    = (payments || []).filter(p => p.status === 'paid').length;
        this.feesPendingCount = (payments || []).filter(p => p.status === 'pending').length;
        const total = this.feesPaidCount + this.feesPendingCount;
        if (total > 0 && this.feesRate === 0) {
          // fallback rate from count
          this.feesRate = Math.round((this.feesPaidCount / total) * 100);
        }
      },
      error: () => {}
    });
  }

  logout(): void {
    this.loginService.logout();
    window.location.href = '/login';
  }
}
