import { Component, OnInit } from '@angular/core';
import { QuizResult, QuizresultService } from 'src/app/services/quizresult.service';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.css']
})
export class QuizResultComponent implements OnInit {


  quizResults: QuizResult[] = [];
  
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedResults: QuizResult[] = [];

  constructor(private quizresultService: QuizresultService) { }

  ngOnInit(): void {
    this.fetchQuizResults();
  }

  fetchQuizResults(): void {
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