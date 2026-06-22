import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-library-issues',
  templateUrl: './library-issues.component.html',
  styleUrls: ['./library-issues.component.css']
})
export class LibraryIssuesComponent implements OnInit {
  issues: any[] = [];
  books: any[] = [];
  members: any[] = [];
  activeTab: 'active' | 'all' = 'active';
  showIssueForm = false;
  selectedBookId: number | null = null;
  selectedMemberId: number | null = null;
  issuing = false;

  constructor(private lib: LibraryService, private snack: MatSnackBar) {}

  ngOnInit() {
    this.loadAll();
    this.lib.getBooks().subscribe((b: any) => this.books = b.filter((x: any) => x.availableCopies > 0));
    this.lib.getMembers().subscribe((m: any) => this.members = m.filter((x: any) => x.status === 'ACTIVE'));
  }

  loadAll() {
    if (this.activeTab === 'active') {
      this.lib.getActiveIssues().subscribe((i: any) => this.issues = i);
    } else {
      this.lib.getIssues().subscribe((i: any) => this.issues = i);
    }
  }

  setTab(tab: 'active' | 'all') { this.activeTab = tab; this.loadAll(); }

  issueBook() {
    if (!this.selectedBookId || !this.selectedMemberId) {
      this.snack.open('Select book and member', '', { duration: 2000 }); return;
    }
    this.issuing = true;
    this.lib.issueBook(this.selectedBookId, this.selectedMemberId).subscribe(
      () => {
        this.snack.open('Book issued successfully!', '', { duration: 2000 });
        this.showIssueForm = false;
        this.selectedBookId = null;
        this.selectedMemberId = null;
        this.issuing = false;
        this.loadAll();
        this.lib.getBooks().subscribe((b: any) => this.books = b.filter((x: any) => x.availableCopies > 0));
      },
      (err: any) => {
        this.snack.open(err?.error?.error || 'Failed to issue book', '', { duration: 3000 });
        this.issuing = false;
      }
    );
  }

  returnBook(id: number) {
    if (!confirm('Confirm book return?')) return;
    this.lib.returnBook(id).subscribe(
      (res: any) => {
        const fine = res.fine > 0 ? ` Fine: ₹${res.fine}` : '';
        this.snack.open(`Book returned!${fine}`, '', { duration: 3000 });
        this.loadAll();
      },
      () => this.snack.open('Failed to return', '', { duration: 2000 })
    );
  }

  isOverdue(dueDate: string): boolean {
    return dueDate ? new Date() > new Date(dueDate) : false;
  }
}
