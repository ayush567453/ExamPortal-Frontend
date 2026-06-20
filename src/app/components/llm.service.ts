import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlmService {
  private apiUrl = 'http://localhost:10101/llm/'; // <-- CHANGE if backend hosted elsewhere

  constructor(private http: HttpClient) {}

  askQuestion(question: string): Observable<string> {
    return this.http.post(this.apiUrl, { question }, { responseType: 'text' });
  }
}
