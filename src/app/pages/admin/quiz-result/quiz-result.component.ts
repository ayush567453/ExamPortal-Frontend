import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { LoginService } from 'src/app/services/login.service';
=======
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
import { QuizResult, QuizresultService } from 'src/app/services/quizresult.service';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
<<<<<<< HEAD
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
=======
  styleUrls: ['./quiz-result.component.css']
})
export class QuizResultComponent implements OnInit {


  quizResults: QuizResult[] = [];
  
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedResults: QuizResult[] = [];

  constructor(private quizresultService: QuizresultService) { }

  ngOnInit(): void {
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
    this.fetchQuizResults();
  }

  fetchQuizResults(): void {
<<<<<<< HEAD
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
=======
    this.quizresultService.getResultUser().subscribe(
      (results: QuizResult[]) => {
        this.quizResults = results;
        this.setPage(this.currentPage);
      },
      (error) => {
        console.error('Error fetching quiz results', error);
      }
    );

  }
  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResults = this.quizResults.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.quizResults.length / this.itemsPerPage);
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }
}
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
