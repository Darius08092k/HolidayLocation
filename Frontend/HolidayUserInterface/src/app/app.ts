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

  constructor(private searchService: SearchService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showSearchBar = !event.url.includes('/admin/accounts');
    });

    this.showSearchBar = !this.router.url.includes('/admin/accounts');
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    this.searchService.setSearchTerm(this.searchQuery);
  }

  onSearchInputChange(): void {
    this.searchService.setSearchTerm(this.searchQuery);
  }
}
