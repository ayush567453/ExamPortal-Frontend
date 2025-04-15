import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { Observable } from 'rxjs';
export interface QuizResult {
  id: number;
  username: string;
  quizName: string;
  marksGot: number;
  correctAnswers: number;
  attempted: number;
  timestamp: string;
  }
@Injectable({
  providedIn: 'root'
})
export class QuizresultService {

  constructor(private http: HttpClient) { }
  public getResultUser(): Observable<QuizResult[]> {
  return this.http.get<QuizResult[]>(`${baseUrl}/quiz-results/allUsers`);
  }
}
