import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-register.componenet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.componenet.html',
  styleUrl: './register.componenet.css'
})
export class RegisterComponenet {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;

    this.authService.register(this.email, this.password, this.confirmPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful. You can now log in.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = typeof err === 'string' ? err : 'Registration failed';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/login']);
  }
}
