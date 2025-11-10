import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from './search.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { filter } from 'rxjs/operators';

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
  showSearchBar: boolean = true;
  isAuthenticated: boolean = false;
  userEmail: string = '';
  showUserDropdown: boolean = false;
  showNavbar: boolean = true;

  constructor(private searchService: SearchService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.checkAuthStatus().subscribe({
      next: (user) => {
        this.isAdmin = user?.roles?.includes('Admin') || false;
        this.isAuthenticated = true;
        this.userEmail = user?.email || '';
      },
      error: () => {
        this.isAdmin = false;
        this.isAuthenticated = false;
        this.userEmail = '';
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.roles?.includes('Admin') || false;
      this.isAuthenticated = !!user;
      this.userEmail = user?.email || '';
    });

    this.authService.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated = authenticated;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showSearchBar = !event.url.includes('/admin/accounts');
      this.showNavbar = !event.url.includes('/login') && !event.url.includes('/register');
    });

    this.showSearchBar = !this.router.url.includes('/admin/accounts');
    this.showNavbar = !this.router.url.includes('/login') && !this.router.url.includes('/register');
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    this.searchService.setSearchTerm(this.searchQuery);
  }

  onSearchInputChange(): void {
    this.searchService.setSearchTerm(this.searchQuery);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown(): void {
    this.showUserDropdown = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.showUserDropdown = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.showUserDropdown = false;
        this.router.navigate(['/login']);
      }
    });
  }

  navigateToAccountSettings(): void {
    this.showUserDropdown = false;
  }
}
