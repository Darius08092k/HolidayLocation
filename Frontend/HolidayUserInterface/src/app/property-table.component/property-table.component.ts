import { Component } from '@angular/core';
import { Property } from '../../Models/property';
import { PropertyService } from '../property.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../enviroment/enviroment';

@Component({
  selector: 'app-property-table.component',
  imports: [CommonModule],
  templateUrl: './property-table.component.html',
  styleUrl: './property-table.component.css'
})
export class PropertyTableComponent {
  protected readonly title = 'Property Gallery Component';

  properties: Property[] = [];
  loading: boolean = false;
  hoveredPropertyId: number | null = null;
  usingMockData: boolean = false;

  // Mock data for testing when API is not available
  public static mockProperties: Property[] = [
    {
      id: 1,
      name: "Seaside Villa",
      details: "Beautiful oceanfront property with stunning views and private beach access",
      rate: 350.00,
      occupancy: 6,
      sqft: 2500,
      imageUrl: `${environment.imageUrl}/Villa1/villa1-main.jpg`,
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
      imageUrl: `${environment.imageUrl}/Villa2/villa2-main.jpg`,
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
      imageUrl: `${environment.imageUrl}/Villa3/villa3-main.jpg`,
      amenity: "WiFi, Gym Access, Rooftop Terrace, Kitchen",
      createdDate: new Date('2024-03-05')
    },
    {
      id: 4,
      name: "Luxury Estate",
      details: "Expansive property with premium amenities and spacious layout",
      rate: 450.00,
      occupancy: 8,
      sqft: 3500,
      imageUrl: `${environment.imageUrl}/Villa1/villa1-main.jpg`,
      amenity: "Pool, Spa, WiFi, Kitchen, Parking, Garden",
      createdDate: new Date('2024-01-20')
    },
    {
      id: 5,
      name: "Countryside Cottage",
      details: "Peaceful rural setting with traditional charm and modern comfort",
      rate: 175.00,
      occupancy: 4,
      sqft: 1600,
      imageUrl: `${environment.imageUrl}/Villa2/villa2-main.jpg`,
      amenity: "Fireplace, Garden, WiFi, Kitchen",
      createdDate: new Date('2024-02-15')
    }
  ];

  constructor(private propertyService: PropertyService, private router: Router) { }

  ngOnInit(): void {
    this.fetchProperties();
  }

  fetchProperties(): void {
    this.loading = true;
    this.usingMockData = false;

    // Add a minimum loading time to allow for API connection attempts
    const minLoadingTime = 10000; // 10 seconds for HTTP API connection attempts
    const startTime = Date.now();

    this.propertyService.getProperties().subscribe(
      (data: Property[]) => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsed);

        setTimeout(() => {
          this.properties = this.propertyService.updatePropertyImageUrls(data);
          this.loading = false;
          this.usingMockData = false;
          console.log('Properties fetched successfully:', this.properties);
        }, remainingTime);
      },
      (error) => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsed);

        setTimeout(() => {
          console.warn('API failed, using mock data:', error);
          this.properties = PropertyTableComponent.mockProperties;
          this.loading = false;
          this.usingMockData = true;
        }, remainingTime);
      }
    );
  }

  onHover(propertyId: number, isHovered: boolean): void {
    this.hoveredPropertyId = isHovered ? propertyId : null;
  }

  onImageError(event: any): void {
    console.warn('Failed to load image:', event.target.src);

    // Fallback hierarchy: try backup server -> villa1 -> online fallback -> placeholder
  if (event.target.src.includes(environment.imageUrl)) {
    // Try backup server first
    event.target.src = event.target.src.replace(environment.imageUrl, environment.backupImageUrl);
  } else if (event.target.src.includes(environment.backupImageUrl)) {
    // Try Villa1 as fallback
    event.target.src = `${environment.imageUrl}/Villa1/villa1-main.jpg`;
  } else if (!event.target.src.includes('images.unsplash.com')) {
    // Try online fallback
    event.target.src = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80';
  } else {
    // Final fallback: placeholder
    event.target.src = 'https://via.placeholder.com/800x600/cccccc/666666?text=Property+Image';
  }
  }

  viewDetails(property: Property): void {
    console.log('Viewing details for:', property.name);
    // Navigate to property details page
    this.router.navigate(['/property', property.id]);
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
