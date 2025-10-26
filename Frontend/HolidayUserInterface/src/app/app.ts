import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from './search.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HolidayUserInterface');
  searchQuery: string = '';
  isAdmin: boolean = false;

  constructor(private searchService: SearchService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (user) => {
        const roles = user?.roles || [];
        this.isAdmin = roles.includes('Admin');
      },
      error: () => {
        this.isAdmin = false;
      }
    });
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    this.searchService.setSearchTerm(this.searchQuery);
  }

  onSearchInputChange(): void {
    // Auto-search as user types
    this.searchService.setSearchTerm(this.searchQuery);
  }
}
