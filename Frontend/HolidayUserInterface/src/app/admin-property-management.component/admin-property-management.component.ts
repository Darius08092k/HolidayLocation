import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Property } from '../../Models/property';
import { PropertyService } from '../services/property/property.service';

@Component({
  selector: 'app-admin-property-management.component',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-property-management.component.html',
  styleUrl: './admin-property-management.component.css'
})
export class AdminPropertyManagementComponent implements OnInit {

  properties: Property[] = [];
  selectedProperty: Property | null = null;
  isEditModalVisible: boolean = false;
  isCreateModalVisible: boolean = false;
  isImageSelectorVisible: boolean = false;
  imageFolders: any[] = [];
  selectedImagePath: string = '';
  isEditingProperty: boolean = false; // Track which form is being used

  // Edit form fields
  editName: string = '';
  editDetails: string = '';
  editRate: number = 0;
  editOccupancy: number = 0;
  editSqft: number = 0;
  editImageUrl: string = '';
  editAmenity: string = '';

  // Create form fields
  newName: string = '';
  newDetails: string = '';
  newRate: number = 0;
  newOccupancy: number = 0;
  newSqft: number = 0;
  newImageUrl: string = '';
  newAmenity: string = '';

  constructor(private propertyService: PropertyService) {}

  fetchAllProperties(): void {
    this.propertyService.getProperties().subscribe(
      (properties: Property[]) => {
        this.properties = properties;
      },
      (error) => {
        console.error('Error fetching properties:', error);
      }
    );
  }

  fetchAvailableImages(): void {
    this.propertyService.getAvailableImages().subscribe(
      (response: any) => {
        this.imageFolders = response.folders;
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }

  openImageSelector(isEditingProperty: boolean): void {
    this.isEditingProperty = isEditingProperty;
    this.selectedImagePath = isEditingProperty ? this.editImageUrl : this.newImageUrl;
    this.fetchAvailableImages();
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }

  selectImage(imagePath: string): void {
    if (this.isEditingProperty) {
      this.editImageUrl = imagePath;
    } else {
      this.newImageUrl = imagePath;
    }
    this.closeImageSelector();
  }

  openEditModal(property: Property): void {
    this.selectedProperty = { ...property };
    this.editName = property.name;
    this.editDetails = property.details;
    this.editRate = property.rate;
    this.editOccupancy = property.occupancy;
    this.editSqft = property.sqft;
    this.editImageUrl = property.imageUrl;
    this.editAmenity = property.amenity;
    this.isEditModalVisible = true;
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.selectedProperty = null;
    this.editName = '';
    this.editDetails = '';
    this.editRate = 0;
    this.editOccupancy = 0;
    this.editSqft = 0;
    this.editImageUrl = '';
    this.editAmenity = '';
  }

  openCreateModal(): void {
    this.newName = '';
    this.newDetails = '';
    this.newRate = 0;
    this.newOccupancy = 0;
    this.newSqft = 0;
    this.newImageUrl = '';
    this.newAmenity = '';
    this.isCreateModalVisible = true;
  }

  closeCreateModal(): void {
    this.isCreateModalVisible = false;
    this.newName = '';
    this.newDetails = '';
    this.newRate = 0;
    this.newOccupancy = 0;
    this.newSqft = 0;
    this.newImageUrl = '';
    this.newAmenity = '';
  }

  saveProperty(): void {
    if (!this.selectedProperty) return;

    const updatedProperty: Property = {
      id: this.selectedProperty.id,
      name: this.editName,
      details: this.editDetails,
      rate: this.editRate,
      occupancy: this.editOccupancy,
      sqft: this.editSqft,
      imageUrl: this.editImageUrl,
      amenity: this.editAmenity,
      createdDate: this.selectedProperty.createdDate
    };

    this.propertyService.updateProperty(this.selectedProperty.id, updatedProperty).subscribe(
      () => {
        console.log('Property updated successfully');
        this.closeEditModal();
        this.fetchAllProperties();
      },
      (error) => {
        console.error('Error updating property:', error);
      }
    );
  }

  createProperty(): void {
    const newProperty: Property = {
      id: 0,
      name: this.newName,
      details: this.newDetails,
      rate: this.newRate,
      occupancy: this.newOccupancy,
      sqft: this.newSqft,
      imageUrl: this.newImageUrl,
      amenity: this.newAmenity,
      createdDate: new Date()
    };

    this.propertyService.createProperty(newProperty).subscribe(
      () => {
        console.log('Property created successfully');
        this.closeCreateModal();
        this.fetchAllProperties();
      },
      (error) => {
        console.error('Error creating property:', error);
      }
    );
  }

  deleteProperty(property: Property): void {
    if (confirm(`Are you sure you want to delete property: ${property.name}?`)) {
      this.propertyService.deleteProperty(property.id).subscribe(
        () => {
          console.log('Property deleted successfully');
          this.fetchAllProperties();
        },
        (error) => {
          console.error('Error deleting property:', error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.fetchAllProperties();
  }
}
