import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private base = `${environment.apiUrl}/api/library`;

  constructor(private http: HttpClient) {}

  getStats()          { return this.http.get(`${this.base}/stats`); }

  // Books
  getBooks()          { return this.http.get(`${this.base}/books`); }
  searchBooks(q: string) { return this.http.get(`${this.base}/books/search?q=${q}`); }
  addBook(b: any)     { return this.http.post(`${this.base}/books`, b); }
  updateBook(id: number, b: any) { return this.http.put(`${this.base}/books/${id}`, b); }
  deleteBook(id: number) { return this.http.delete(`${this.base}/books/${id}`); }

  // Members
  getMembers()        { return this.http.get(`${this.base}/members`); }
  addMember(m: any)   { return this.http.post(`${this.base}/members`, m); }
  updateMember(id: number, m: any) { return this.http.put(`${this.base}/members/${id}`, m); }
  deleteMember(id: number) { return this.http.delete(`${this.base}/members/${id}`); }

  // Issues
  getIssues()         { return this.http.get(`${this.base}/issues`); }
  getActiveIssues()   { return this.http.get(`${this.base}/issues/active`); }
  issueBook(bookId: number, memberId: number) {
    return this.http.post(`${this.base}/issues`, { bookId, memberId });
  }
  returnBook(id: number) { return this.http.put(`${this.base}/issues/${id}/return`, {}); }
}
