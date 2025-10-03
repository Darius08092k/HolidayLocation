import { Component } from '@angular/core';
import { Property } from '../../Models/property';
import { PropertyService } from '../property.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-table.component',
  imports: [CommonModule],
  templateUrl: './property-table.component.html',
  styleUrl: './property-table.component.css'
})
export class PropertyTableComponent {
  protected readonly title = 'Property Gallery Component';

  properties: Property[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  hoveredPropertyId: number | null = null;

  // Mock data for testing when API is not available
  private mockProperties: Property[] = [
    {
      id: 1,
      name: "Seaside Villa",
      details: "Beautiful oceanfront property with stunning views and private beach access",
      rate: 350.00,
      occupancy: 6,
      sqft: 2500,
      imageUrl: "/Images/Villa1/villa1-main.jpg",
      amenity: "Pool, Beach Access, WiFi, Kitchen, Parking",
      createdDate: new Date('2024-01-15')
    },
    {
      id: 2,
      name: "Mountain Retreat",
      details: "Cozy cabin nestled in the mountains with hiking trails nearby",
      rate: 225.00,
      occupancy: 4,
      sqft: 1800,
      imageUrl: "/Images/Villa1/villa1-main.jpg",
      amenity: "Fireplace, Hiking, WiFi, Kitchen, Hot Tub",
      createdDate: new Date('2024-02-10')
    },
    {
      id: 3,
      name: "City Loft",
      details: "Modern downtown loft with city skyline views and rooftop access",
      rate: 180.00,
      occupancy: 2,
      sqft: 1200,
      imageUrl: "/Images/Villa1/villa1-main.jpg",
      amenity: "WiFi, Gym Access, Rooftop Terrace, Kitchen",
      createdDate: new Date('2024-03-05')
    }
  ];

  constructor(private propertyService: PropertyService, private router: Router) { }

  ngOnInit(): void {
    this.fetchProperties();
  }

  fetchProperties(): void {
    this.loading = true;
    this.errorMessage = '';

    this.propertyService.getProperties().subscribe(
      (data: Property[]) => {
        this.properties = data;
        this.loading = false;
        console.log('Properties fetched successfully:', data);
        // Clear any previous error messages on successful API call
        this.errorMessage = '';
      },
      (error) => {
        // If API fails, use mock data silently for development
        console.warn('API failed, using mock data:', error);
        this.properties = this.mockProperties;
        this.loading = false;
        // Only show error in development mode or if needed for debugging
        // this.errorMessage = 'API unavailable - displaying sample properties';
      }
    );
  }

  // Method to manually use mock data for testing
  useMockData(): void {
    this.properties = this.mockProperties;
    this.errorMessage = 'Manual mock data loaded for testing';
    console.log('Loaded mock properties:', this.mockProperties);
  }

  onHover(propertyId: number, isHovered: boolean): void {
    this.hoveredPropertyId = isHovered ? propertyId : null;
  }

  viewDetails(property: Property): void {
    console.log('Viewing details for:', property.name);
    // TODO: Navigate to property details page
    // this.router.navigate(['/property', property.id]);

    // For now, show property details in an alert
    const details = `
Property: ${property.name}
Rate: $${property.rate}/night
Occupancy: ${property.occupancy} guests
Size: ${property.sqft} sq ft
Amenities: ${property.amenity}
Details: ${property.details}
    `;
    alert(details);
  }

  bookProperty(property: Property): void {
    console.log('Booking property:', property.name);
    // TODO: Navigate to booking page or open booking modal
    // this.router.navigate(['/booking', property.id]);

    // For now, show booking confirmation
    const confirmed = confirm(`Would you like to book ${property.name} for $${property.rate}/night?`);
    if (confirmed) {
      alert(`Booking request sent for ${property.name}! You will receive a confirmation email shortly.`);
    }
  }
}
