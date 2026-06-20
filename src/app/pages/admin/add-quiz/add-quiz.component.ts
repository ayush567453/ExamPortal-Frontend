import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { LoginService } from 'src/app/services/login.service';
import { QuizService } from 'src/app/services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css'],
})
export class AddQuizComponent implements OnInit {
  categories: any[] = [];
  loading = false;
  role = '';
  tenantId = '';

  quizData: any = {
    title: '',
    description: '',
    maxMarks: '',
    numberOfQuestions: '',
    active: true,
    category: { cid: '' },
  };

  constructor(
    private _cat: CategoryService,
    private _quiz: QuizService,
    private _login: LoginService
  ) {}

  ngOnInit(): void {
    this.role = this._login.getUserRole() || '';
    this.tenantId = this._login.getTenantId();

    const load$ =
      this.role === 'SCHOOL_ADMIN' && this.tenantId
        ? this._cat.categoriesByTenant(this.tenantId)
        : this._cat.categories();

    load$.subscribe({
      next: (data: any) => (this.categories = data),
      error: () => Swal.fire('Error', 'Could not load categories', 'error'),
    });
  }

  addQuiz() {
    if (!this.quizData.title.trim()) {
      Swal.fire('Validation', 'Quiz title is required', 'warning');
      return;
    }
    if (!this.quizData.category.cid) {
      Swal.fire('Validation', 'Please select a category', 'warning');
      return;
    }

    this.loading = true;
    this._quiz.addQuiz(this.quizData).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Success', 'Quiz added successfully!', 'success');
        this.quizData = {
          title: '',
          description: '',
          maxMarks: '',
          numberOfQuestions: '',
          active: true,
          category: { cid: '' },
        };
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Failed to add quiz', 'error');
        console.error(err);
      },
    });
  }
}
