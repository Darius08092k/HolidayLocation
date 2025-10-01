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
  protected readonly title = 'Property Table Component';

  properties: Property[] = [];

  constructor(private propertyService: PropertyService, private router:Router) { }

  ngOnInit(): void {
    this.fetchProperties();
  }

  fetchProperties(): void {
    this.propertyService.getProperties().subscribe(
      (data: Property[]) => {
        this.properties = data;
        console.log('Properties fetched successfully:', data);
      },
      (error) => {
        console.error('Error fetching properties:', error);
      }
    );
  }
}
