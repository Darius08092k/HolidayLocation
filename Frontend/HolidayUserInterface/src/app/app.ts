import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HolidayUserInterface');
  searchQuery: string = '';

  constructor(private searchService: SearchService) {}

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    this.searchService.setSearchTerm(this.searchQuery);
  }

  onSearchInputChange(): void {
    // Auto-search as user types
    this.searchService.setSearchTerm(this.searchQuery);
  }
}
