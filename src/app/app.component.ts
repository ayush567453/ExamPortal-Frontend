import { Component } from '@angular/core';
<<<<<<< HEAD
import { Router, NavigationEnd } from '@angular/router';

=======
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'TestYourself';
<<<<<<< HEAD
  showNavbar = true;

  // Routes where the global navbar should be hidden
  private noNavbarPrefixes = ['/admin', '/school-admin', '/super-admin'];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.showNavbar = !this.noNavbarPrefixes.some(prefix => url.startsWith(prefix));
      }
    });
  }
=======
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
}
