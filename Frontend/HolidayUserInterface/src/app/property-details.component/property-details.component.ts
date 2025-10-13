import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../Models/property';
import { PropertyService } from '../property.service';
import { PropertyTableComponent } from '../property-table.component/property-table.component';
import { environment } from '../../enviroment/enviroment';

@Component({
  selector: 'app-property-details',
  imports: [CommonModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  propertyId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    // Get the property ID from the route parameters
    this.route.params.subscribe(params => {
      this.propertyId = +params['id']; // '+' converts string to number
      if (this.propertyId) {
        this.loadPropertyDetails();
      }
    });
  }

  loadPropertyDetails(): void {
    this.loading = true;
    this.errorMessage = '';

    // Try to get property from service first
    this.propertyService.getProperties().subscribe(
      (properties: Property[]) => {
        const foundProperty = properties.find(p => p.id === this.propertyId);
        if (foundProperty) {
          this.property = foundProperty;
          // Ensure the image URL is properly formatted from backend
          if (this.property.imageUrl && !this.property.imageUrl.startsWith('http')) {
            this.property.imageUrl = `${environment.imageUrl}${this.property.imageUrl}`;
          }
          console.log('Property loaded with image:', this.property.imageUrl);
        } else {
          this.errorMessage = 'Property not found.';
        }
        this.loading = false;
      },
      (error) => {
        console.warn('API failed, using mock data for property details:', error);
        // Fallback to mock data if API fails
        this.loadMockPropertyDetails();
        this.loading = false;
      }
    );
  }

  private loadMockPropertyDetails(): void {
    // Use mock property data from PropertyTableComponent
    const foundProperty = PropertyTableComponent.mockProperties.find(p => p.id === this.propertyId);
    if (foundProperty) {
      this.property = foundProperty;
    } else {
      this.errorMessage = 'Property not found.';
    }
  }

  onImageError(event: any): void {
    console.warn('Failed to load image:', event.target.src);

    // Fallback hierarchy: try backup server -> villa1 -> online fallback -> placeholder
    if (event.target.src.includes(environment.imageUrl)) {
      // Try backup server first
      event.target.src = event.target.src.replace(environment.imageUrl, environment.backupImageUrl);
      console.log('Trying backup server:', event.target.src);
    } else if (event.target.src.includes(environment.backupImageUrl)) {
      // Try Villa1 as fallback
      event.target.src = `${environment.imageUrl}Images/Villa1/villa1-main.jpg`;
      console.log('Trying Villa1 fallback');
    } else if (!event.target.src.includes('images.unsplash.com')) {
      // Try online fallback
      event.target.src = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80';
      console.log('Trying online fallback');
    } else {
      // Final fallback: placeholder
      event.target.src = 'https://via.placeholder.com/800x600/cccccc/666666?text=Property+Image';
      console.log('Using placeholder');
    }
  }

  goBack(): void {
    this.router.navigate(['/Property']);
  }

  bookProperty(): void {
    if (this.property) {
      console.log('Booking property:', this.property.name);
      const confirmed = confirm(`Would you like to book ${this.property.name} for $${this.property.rate}/night?`);
      if (confirmed) {
        alert(`Booking request sent for ${this.property.name}! You will receive a confirmation email shortly.`);
      }
    }
  }
}
