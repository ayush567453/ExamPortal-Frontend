import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { SchoolAdminService } from 'src/app/services/school-admin.service';

interface SlotData {
  subject: string;
  teacher: string;
  color: string;
}

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  tenantId = '';
  classes: any[] = [];
  selectedClass = '';
  selectedSection = '';

  days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  periods: { label: string; time: string; isBreak?: boolean }[] = [
    { label: 'Period 1', time: '8:00 – 8:45' },
    { label: 'Period 2', time: '8:45 – 9:30' },
    { label: 'Break',    time: '9:30 – 9:45',  isBreak: true },
    { label: 'Period 3', time: '9:45 – 10:30' },
    { label: 'Period 4', time: '10:30 – 11:15' },
    { label: 'Lunch',    time: '11:15 – 12:00', isBreak: true },
    { label: 'Period 5', time: '12:00 – 12:45' },
    { label: 'Period 6', time: '12:45 – 1:30' },
    { label: 'Period 7', time: '1:30 – 2:15' },
    { label: 'Period 8', time: '2:15 – 3:00' },
  ];

  subjectColors: { [key: string]: string } = {
    'Mathematics': '#2563eb',
    'Science': '#059669',
    'English': '#7c3aed',
    'Hindi': '#d97706',
    'Social Studies': '#0891b2',
    'Computer': '#be185d',
    'Physics': '#1d4ed8',
    'Chemistry': '#065f46',
    'Biology': '#16a34a',
    'History': '#b45309',
    'Geography': '#0e7490',
    'Physical Education': '#dc2626',
    'Art': '#9333ea',
    'Music': '#c2410c',
    'Free Period': '#94a3b8',
  };

  subjectList = Object.keys(this.subjectColors);

  timetable: { [day: string]: { [period: string]: SlotData } } = {};

  editMode = false;
  editingCell: { day: string; period: string } | null = null;
  editSlot: SlotData = { subject: '', teacher: '', color: '#2563eb' };

  // Per-class timetable storage key
  private storageKey(classId: string): string {
    return `tt_${this.tenantId}_${classId}`;
  }

  constructor(
    private loginService: LoginService,
    private schoolService: SchoolAdminService
  ) {}

  // Fallback class list when no classes exist in DB
  readonly defaultClasses = [
    { id: 'nur', name: 'Nursery', section: '' },
    { id: 'kg1', name: 'KG-1',    section: '' },
    { id: 'kg2', name: 'KG-2',    section: '' },
    { id: 'c1a', name: 'Class 1', section: 'A' },
    { id: 'c1b', name: 'Class 1', section: 'B' },
    { id: 'c2a', name: 'Class 2', section: 'A' },
    { id: 'c3a', name: 'Class 3', section: 'A' },
    { id: 'c4a', name: 'Class 4', section: 'A' },
    { id: 'c5a', name: 'Class 5', section: 'A' },
    { id: 'c6a', name: 'Class 6', section: 'A' },
    { id: 'c7a', name: 'Class 7', section: 'A' },
    { id: 'c8a', name: 'Class 8', section: 'A' },
    { id: 'c9a', name: 'Class 9', section: 'A' },
    { id: 'c10a', name: 'Class 10', section: 'A' },
    { id: 'c11a', name: 'Class 11', section: 'A' },
    { id: 'c12a', name: 'Class 12', section: 'A' },
  ];

  ngOnInit(): void {
    this.tenantId = this.loginService.getTenantId();
    this.schoolService.getClasses(this.tenantId).subscribe({
      next: (data) => {
        this.classes = (data && data.length) ? data : this.defaultClasses;
      },
      error: () => {
        this.classes = this.defaultClasses;
      }
    });
    this.initTimetable();
  }

  initTimetable(): void {
    this.days.forEach(day => {
      this.timetable[day] = {};
      this.periods.forEach(p => {
        this.timetable[day][p.label] = { subject: '', teacher: '', color: '' };
      });
    });
  }

  onClassChange(): void {
    if (!this.selectedClass) { this.initTimetable(); return; }
    const saved = localStorage.getItem(this.storageKey(this.selectedClass));
    if (saved) {
      try { this.timetable = JSON.parse(saved); } catch { this.initTimetable(); }
    } else {
      this.initTimetable();
    }
  }

  private persistTimetable(): void {
    if (!this.selectedClass) return;
    localStorage.setItem(this.storageKey(this.selectedClass), JSON.stringify(this.timetable));
  }

  getSlot(day: string, period: string): SlotData {
    return this.timetable[day]?.[period] || { subject: '', teacher: '', color: '' };
  }

  openEdit(day: string, period: string): void {
    if (!this.editMode) return;
    this.editingCell = { day, period };
    const existing = this.getSlot(day, period);
    this.editSlot = { ...existing };
  }

  onSubjectChange(): void {
    this.editSlot.color = this.subjectColors[this.editSlot.subject] || '#94a3b8';
  }

  saveSlot(): void {
    if (!this.editingCell) return;
    const { day, period } = this.editingCell;
    if (!this.timetable[day]) this.timetable[day] = {};
    this.timetable[day][period] = { ...this.editSlot };
    this.editingCell = null;
    this.persistTimetable();
  }

  clearSlot(): void {
    if (!this.editingCell) return;
    const { day, period } = this.editingCell;
    this.timetable[day][period] = { subject: '', teacher: '', color: '' };
    this.editingCell = null;
    this.persistTimetable();
  }

  printTimetable(): void {
    window.print();
  }

  get nonBreakPeriods() {
    return this.periods.filter(p => !p.isBreak);
  }
}
