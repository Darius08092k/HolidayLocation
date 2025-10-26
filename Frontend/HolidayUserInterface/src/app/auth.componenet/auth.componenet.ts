import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auth.componenet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.componenet.html',
  styleUrl: './auth.componenet.css'
})
export class AuthComponenet {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void
  {
    this.errorMessage = '';
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/Property']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = typeof err === 'string' ? err : (err?.error?.message || 'Login failed');
        this.isLoading = false;
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }


}
