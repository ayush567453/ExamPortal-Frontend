import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-library-books',
  templateUrl: './library-books.component.html',
  styleUrls: ['./library-books.component.css']
})
export class LibraryBooksComponent implements OnInit {
  books: any[] = [];
  filtered: any[] = [];
  searchQ = '';
  showForm = false;
  editMode = false;
  saving = false;

  form: any = { title: '', author: '', isbn: '', genre: '', publisher: '', publishedYear: null, totalCopies: 1, availableCopies: 1, description: '' };

  genres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Mathematics', 'Technology', 'Literature', 'Biography', 'Reference', 'Other'];

  constructor(private lib: LibraryService, private snack: MatSnackBar) {}

  ngOnInit() { this.load(); }

  load() {
    this.lib.getBooks().subscribe((b: any) => { this.books = b; this.filtered = b; });
  }

  search() {
    if (!this.searchQ.trim()) { this.filtered = this.books; return; }
    this.lib.searchBooks(this.searchQ).subscribe((b: any) => this.filtered = b);
  }

  openAdd() { this.form = { title: '', author: '', isbn: '', genre: '', publisher: '', publishedYear: null, totalCopies: 1, availableCopies: 1, description: '' }; this.editMode = false; this.showForm = true; }

  openEdit(book: any) { this.form = { ...book }; this.editMode = true; this.showForm = true; }

  save() {
    if (!this.form.title || !this.form.author) { this.snack.open('Title and Author are required', '', { duration: 2000 }); return; }
    this.saving = true;
    const obs = this.editMode ? this.lib.updateBook(this.form.id, this.form) : this.lib.addBook(this.form);
    obs.subscribe(() => { this.snack.open(this.editMode ? 'Book updated!' : 'Book added!', '', { duration: 2000 }); this.showForm = false; this.saving = false; this.load(); }, () => { this.saving = false; });
  }

  delete(id: number) {
    if (!confirm('Delete this book?')) return;
    this.lib.deleteBook(id).subscribe(() => { this.snack.open('Book deleted', '', { duration: 2000 }); this.load(); });
  }
}
