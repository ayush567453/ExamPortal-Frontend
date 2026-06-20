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
<<<<<<< HEAD
    return this.http.get<QuizResult[]>(`${baseUrl}/quiz-results/allUsers`);
  }

  public getResultsByTenant(tenantId: string): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${baseUrl}/quiz-results/tenant/${tenantId}`);
=======
  return this.http.get<QuizResult[]>(`${baseUrl}/quiz-results/allUsers`);
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
  }
}
