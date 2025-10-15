import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property } from '../../Models/property';
import { Booking } from '../../Models/booking';
import { BookingService } from '../services/booking/booking.service';
import { retry } from 'rxjs';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css'
})
export class BookingDetailsComponent {

  @Input() property: Property | null = null;
  @Input() isVisible: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  // Form fields
  checkInDate: string= '';
  checkOutDate: string= '';
  customerName: string= '';
  customerEmail: string= '';
  customerPhone: string= '';

  // Computed values
  numberOfNights: number = 0;
  totalCost: number = 0;

  // State management
  isCheckingAvailability: boolean = false;
  isAvailable: boolean | null = null;
  isSubmitting: boolean = false;

  // Error handling
  availabilityError: string = '';
  validationErrors: { [key: string]: string } = {};
  submitError: string = '';

  // Success state
  bookingSuccess: boolean = false;
  confirmedBooking: Booking | null = null;

   // Date constraints
  minDate: string = '';
  minCheckOutDate: string = '';

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.setMinDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && changes['isVisible'].currentValue) {
      this.resetForm();
    }
  }

  setMinDate(): void{
    const today = new Date();
    this.minDate = this.formatDateForInput(today);
  }

  // Format date for HTML date input (YYYY-MM-DD)
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onCheckInChange(): void {
    if(this.checkInDate)
    {
      const checkIn = new Date(this.checkInDate);
      this.minCheckOutDate = this.formatDateForInput(new Date(checkIn.setDate(checkIn.getDate() + 1)));
    }

    // TODO: Add a message if checkOutDate is before checkInDate

    this.calculateStay();
    this.checkAvailability();
  }

  // Called when check-out date changes
  onCheckOutChange(): void {
    this.validationErrors['checkOut'] = '';
    this.calculateStay();
    this.checkAvailabilityIfDatesSet();
  }

  calculateStay(): void {
    if (this.checkInDate && this.checkOutDate && this.property) {

      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);

      this.totalCost = this.bookingService.calculateTotalCost(checkIn, checkOut, this.property.rate);
    }
    else{
      this.totalCost = 0;
    }
  }

  checkAvailabilityIfDatesSet(): void {
    if (this.checkInDate && this.checkOutDate && this.property) {
      this.checkAvailability();
    }
    else
    {
      this.isAvailable = null;
      this.availabilityError = '';
    }
  }

  checkAvailability(): void {
    if(!this.property || !this.checkInDate || !this.checkOutDate)
    {
      return;
    }

    // TODO: Check availability


    this.isCheckingAvailability = true;
    this.availabilityError = '';
    this.isAvailable = true;

this.bookingService.checkPropertyAvailability(
      this.property.id!,
      new Date(this.checkInDate),
      new Date(this.checkOutDate)
    ).subscribe({
      next: (available) => {
        this.isCheckingAvailability = false;
        this.isAvailable = available;
        if (!available) {
          this.availabilityError = 'Property is not available for the selected dates. Please choose different dates.';
        }
      },
      error: (error) => {
        this.isCheckingAvailability = false;
        this.isAvailable = false;
        this.availabilityError = 'Unable to check availability. Please try again.';
        console.error('Availability check failed:', error);
      }
    });
  }

  // Reset form to initial state
  resetForm(): void {
    this.checkInDate = '';
    this.checkOutDate = '';
    this.customerName = '';
    this.customerEmail = '';
    this.customerPhone = '';
    this.numberOfNights = 0;
    this.totalCost = 0;
    this.isCheckingAvailability = false;
    this.isAvailable = null;
    this.isSubmitting = false;
    this.availabilityError = '';
    this.validationErrors = {};
    this.submitError = '';
    this.bookingSuccess = false;
    this.confirmedBooking = null;
  }

  closeModal(): void{
    this.isVisible = false;
    this.onClose.emit();
  }
  closeAndReset(): void{
    this.closeModal();
    this.resetForm();
  }

  submitBooking(): void {
    if (!this.property) {
      return;
    }

    if (this.isAvailable === false) {
      this.submitError = 'Property is not available for the selected dates.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const booking: Booking = {
      propertyId: this.property.id!,
      checkInDate: new Date(this.checkInDate),
      checkOutDate: new Date(this.checkOutDate),
      customerName: this.customerName.trim(),
      customerEmail: this.customerEmail.trim(),
      customerPhone: this.customerPhone.trim() || undefined,
      bookingDate: new Date(),
      status: 'Confirmed'
    };

    console.log('Booking submitted for:', this.property?.name);
    this.bookingService.createBooking(booking).subscribe({
      next: (confirmedBooking) => {
        this.isSubmitting = false;
        this.bookingSuccess = true;
        this.confirmedBooking = confirmedBooking;
        console.log('Booking successful:', confirmedBooking);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = 'Failed to create booking. Please try again.';
        console.error('Booking failed:', error);
      }
    });
  }
  }

