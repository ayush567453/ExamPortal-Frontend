import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-dashboard',
  templateUrl: './library-dashboard.component.html',
  styleUrls: ['./library-dashboard.component.css']
})
export class LibraryDashboardComponent implements OnInit {
  stats: any = { totalBooks: 0, totalMembers: 0, issuedBooks: 0, overdueBooks: 0, availableBooks: 0 };
  recentIssues: any[] = [];
  loading = true;
  librarianName = 'Librarian';

  constructor(private lib: LibraryService, private router: Router) {}

  ngOnInit() {
    this.lib.getStats().subscribe(
      (s: any) => { this.stats = s; this.loading = false; },
      () => { this.loading = false; }
    );
    this.lib.getActiveIssues().subscribe((issues: any) => {
      this.recentIssues = issues.slice(0, 5);
    }, () => {});
  }

  logout() {
    sessionStorage.removeItem('librarian');
    this.router.navigate(['/login']);
  }

  navigate(path: string) { this.router.navigate([path]); }
}
