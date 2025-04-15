import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  email: string = '';

  constructor(private authService: AuthserviceService) {}

  ngOnInit(): void {}

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission behavior
    this.authService.forgotPassword(this.email).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password reset email sent successfully!',
        });
      },
      error => {
        if (error.status === 400 && error.error === 'User not found') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Email does not exist.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while sending the password reset email.',
          });
        }
      }
    );
  }
}
