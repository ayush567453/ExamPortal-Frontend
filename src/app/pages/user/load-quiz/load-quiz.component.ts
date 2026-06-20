import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-load-quiz',
  templateUrl: './load-quiz.component.html',
  styleUrls: ['./load-quiz.component.css'],
})
export class LoadQuizComponent implements OnInit {
  catId: any;
  quizzes: any[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _quiz: QuizService,
    private _login: LoginService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.catId = params['catId'];
      const role = this._login.getUserRole();
      const tenantId = this._login.getTenantId();
      const isTenantUser = tenantId && (role === 'STUDENT' || role === 'SCHOOL_ADMIN' || role === 'TEACHER');

      if (this.catId == 0) {
        // All quizzes — filter by tenant if school user
        if (isTenantUser) {
          this._quiz.getActiveQuizzesByTenant(tenantId).subscribe({
            next: (data: any) => { this.quizzes = data; },
            error: () => alert('Error loading quizzes')
          });
        } else {
          this._quiz.getActiveQuizzes().subscribe({
            next: (data: any) => { this.quizzes = data; },
            error: () => alert('Error loading quizzes')
          });
        }
      } else {
        // Category-specific quizzes
        this._quiz.getActiveQuizzesOfCategory(this.catId).subscribe({
          next: (data: any) => { this.quizzes = data; },
          error: () => alert('Error loading quiz data')
        });
      }
    });
  }
}
