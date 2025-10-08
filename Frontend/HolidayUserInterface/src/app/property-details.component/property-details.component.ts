import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../Models/property';
import { PropertyService } from '../property.service';
import { PropertyTableComponent } from '../property-table.component/property-table.component';

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
    // Simple fallback hierarchy: villa1 -> online fallback -> placeholder
    if (!event.target.src.includes('/Images/Villa1/villa1-main.jpg')) {
      event.target.src = '/Images/Villa1/villa1-main.jpg';
    } else if (!event.target.src.includes('images.unsplash.com')) {
      event.target.src = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80';
    } else {
      event.target.src = 'https://via.placeholder.com/800x600/cccccc/666666?text=Property+Image';
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
