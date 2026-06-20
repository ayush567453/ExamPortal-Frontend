import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { CategoryService } from 'src/app/services/category.service';
import { LoginService } from 'src/app/services/login.service';
=======
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
import { QuizService } from 'src/app/services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css'],
})
export class AddQuizComponent implements OnInit {
<<<<<<< HEAD
  categories: any[] = [];
  loading = false;
  role = '';
  tenantId = '';

  quizData: any = {
=======
  categories = [];

  quizData = {
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
    title: '',
    description: '',
    maxMarks: '',
    numberOfQuestions: '',
    active: true,
<<<<<<< HEAD
    category: { cid: '' },
=======
    category: {
      cid: '',
    },
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
  };

  constructor(
    private _cat: CategoryService,
<<<<<<< HEAD
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
=======
    private _snack: MatSnackBar,
    private _quiz: QuizService
  ) {}

  ngOnInit(): void {
    this._cat.categories().subscribe(
      (data: any) => {
        //categories load
        this.categories = data;
        // console.log(this.categories);
      },

      (error) => {
        console.log(error);
        Swal.fire('Error!!', 'error in loading data from server', 'error');
      }
    );
  }
  //
  addQuiz() {
    if (this.quizData.title.trim() == '' || this.quizData.title == null) {
      this._snack.open('Title Required !!', '', {
        duration: 3000,
      });
      return;
    }

    //validation...

    //call server
    this._quiz.addQuiz(this.quizData).subscribe(
      (data) => {
        Swal.fire('Success', 'quiz is added', 'success');
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
        this.quizData = {
          title: '',
          description: '',
          maxMarks: '',
          numberOfQuestions: '',
          active: true,
<<<<<<< HEAD
          category: { cid: '' },
        };
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Failed to add quiz', 'error');
        console.error(err);
      },
    });
=======
          category: {
            cid: '',
          },
        };
      },

      (error) => {
        Swal.fire('Error!! ', 'Error while adding quiz', 'error');
        console.log(error);
      }
    );
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
  }
}
