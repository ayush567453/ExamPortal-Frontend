import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  password: string;
  token: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthserviceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit() {
    this.authService.resetPassword(this.token, this.password).subscribe(
      response => {
        console.log('Password reset successfully', response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error resetting password', error);
      }
    );
  }

}
