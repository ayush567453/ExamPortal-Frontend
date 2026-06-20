import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { QuizService } from 'src/app/services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-quizzes',
  templateUrl: './view-quizzes.component.html',
  styleUrls: ['./view-quizzes.component.css'],
})
export class ViewQuizzesComponent implements OnInit {
  quizzes: any[] = [];
  loading = true;
  searchTerm = '';
  role = '';
  tenantId = '';

  constructor(private _quiz: QuizService, private _login: LoginService) {}

  ngOnInit(): void {
    this.role = this._login.getUserRole() || '';
    this.tenantId = this._login.getTenantId();
    this.loadQuizzes();
  }

  loadQuizzes() {
    this.loading = true;
    const load$ =
      this.role === 'SCHOOL_ADMIN' && this.tenantId
        ? this._quiz.getQuizzesByTenant(this.tenantId)
        : this._quiz.quizzes();

    load$.subscribe({
      next: (data: any) => {
        this.quizzes = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Could not load quizzes', 'error');
      },
    });
  }

  get filtered() {
    if (!this.searchTerm.trim()) return this.quizzes;
    const q = this.searchTerm.toLowerCase();
    return this.quizzes.filter(
      (x) =>
        x.title?.toLowerCase().includes(q) ||
        x.category?.title?.toLowerCase().includes(q)
    );
  }

  deleteQuiz(qId: any) {
    Swal.fire({
      icon: 'warning',
      title: 'Delete Quiz?',
      text: 'This action cannot be undone.',
      confirmButtonText: 'Delete',
      confirmButtonColor: '#ef4444',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this._quiz.deleteQuiz(qId).subscribe({
          next: () => {
            this.quizzes = this.quizzes.filter((q) => q.qId !== qId);
            Swal.fire('Deleted', 'Quiz removed successfully', 'success');
          },
          error: () => Swal.fire('Error', 'Could not delete quiz', 'error'),
        });
      }
    });
  }
}
