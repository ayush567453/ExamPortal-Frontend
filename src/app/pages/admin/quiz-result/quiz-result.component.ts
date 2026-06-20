import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { QuizResult, QuizresultService } from 'src/app/services/quizresult.service';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.css'],
})
export class QuizResultComponent implements OnInit {
  quizResults: QuizResult[] = [];
  paginatedResults: QuizResult[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  loading = true;
  searchTerm = '';
  role = '';
  tenantId = '';

  constructor(
    private quizresultService: QuizresultService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.role = this.loginService.getUserRole() || '';
    this.tenantId = this.loginService.getTenantId();
    this.fetchQuizResults();
  }

  fetchQuizResults(): void {
    this.loading = true;
    const load$ =
      this.role === 'SCHOOL_ADMIN' && this.tenantId
        ? this.quizresultService.getResultsByTenant(this.tenantId)
        : this.quizresultService.getResultUser();

    load$.subscribe({
      next: (results) => {
        this.quizResults = results;
        this.currentPage = 1;
        this.paginate();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  get filtered(): QuizResult[] {
    if (!this.searchTerm.trim()) return this.quizResults;
    const q = this.searchTerm.toLowerCase();
    return this.quizResults.filter(
      (r) =>
        r.username?.toLowerCase().includes(q) ||
        r.quizName?.toLowerCase().includes(q)
    );
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedResults = this.filtered.slice(start, start + this.itemsPerPage);
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.itemsPerPage);
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.paginate();
  }
}
