import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../enviroment/enviroment';
import { Booking, BookedDate } from '../../../Models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.apiUrl;
  private backupApiUrl = environment.backupApiUrl;

  constructor(private http: HttpClient) { }

  // Create a new booking
  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/BookingAPI`, booking, { withCredentials: true })
      .pipe(
        timeout(5000),
        retry(1),
        catchError((error: HttpErrorResponse) => {
          console.error('Primary booking API failed, trying backup...', error);
          return this.http.post<Booking>(`${this.backupApiUrl}/BookingAPI`, booking, { withCredentials: true })
            .pipe(
              timeout(8000),
              catchError((error: HttpErrorResponse) => {
                console.error('Backup booking API failed as well.', error);
                return throwError(error);
              })
            );
        })
      );
  }

  // Get all bookings
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/BookingAPI`, { withCredentials: true })
      .pipe(
        timeout(5000),
        retry(1),
        catchError((error: HttpErrorResponse) => {
          console.error('Primary booking API failed, trying backup...', error);
          return this.http.get<Booking[]>(`${this.backupApiUrl}/BookingAPI`, { withCredentials: true })
            .pipe(
              timeout(8000),
              catchError((error: HttpErrorResponse) => {
                console.error('Backup booking API failed as well.', error);
                return throwError(error);
              })
            );
        })
      );
  }

  // Get booking by ID
  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/BookingAPI/${id}`, { withCredentials: true })
      .pipe(
        timeout(8000),
        catchError((error: HttpErrorResponse) => {
          console.error('Backup booking API failed as well.', error);
          return throwError(error);
        })
      );
  }

  // Get booking by property ID
  getBookingByPropertyId(propertyId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/BookingAPI/property/${propertyId}`, { withCredentials: true })
      .pipe(
        timeout(8000),
        catchError((error: HttpErrorResponse) => {
          console.error('Backup booking API failed as well.', error);
          return throwError(error);
        })
      )
  }
  // Delete a booking
  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/BookingAPI/${id}`, { withCredentials: true })
      .pipe(
        timeout(8000),
          catchError((error: HttpErrorResponse) => {
          console.error('Backup booking API failed as well.', error);
          return throwError(error);
        })
            );
  }

  // Check if property is available for given dates
  checkPropertyAvailability(propertyId: number, checkIn: Date, checkOut: Date): Observable<boolean> {
    const checkInStr = this.formatDate(checkIn);
    const checkOutStr = this.formatDate(checkOut);

    return this.http.get<boolean>(`${this.apiUrl}/BookingAPI/property/${propertyId}/availability?checkIn=${checkInStr}&checkOut=${checkOutStr}`, { withCredentials: true })
      .pipe(
        timeout(8000),
        catchError((error: HttpErrorResponse) => {
          console.error('Backup booking API failed as well.', error);
          return throwError(error);
        })
      );
    }

  // Check if property is available for given dates
  checkAvailability(propertyId: number,
    checkInDate: Date,
    checkOutDate: Date): Observable<boolean>
  {
    return this.http.get<boolean>(`${this.apiUrl}/BookingAPI/property/${propertyId}/availability?checkIn=${checkInDate}&checkOut=${checkOutDate}`, { withCredentials: true })
      .pipe(
        timeout(8000),
        catchError((error: HttpErrorResponse) => {
          console.error('Backup booking API failed as well.', error);
          return throwError(() => error);
        })
      )
  }

  // Calculate total cost
  calculateTotalCost(checkIn: Date, checkOut: Date, ratePerNight: number): number {
    const nights = this.calculateNights(checkIn, checkOut);
    return nights * ratePerNight;
  }

  // Calculate total nights between dates
  calculateNights(checkIn: Date, checkOut: Date): number {
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();
    const timeDiff = checkOutTime - checkInTime;
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nights > 0 ? nights : 0;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getBookedDates(propertyId: number, startDate: Date, endDate: Date): Observable<Date[]> {
    const startStr = this.formatDate(startDate);
    const endStr = this.formatDate(endDate);
    return this.http.get<Date[]>(
      `${this.apiUrl}/BookingAPI/property/${propertyId}/bookedDates?startDate=${startStr}&endDate=${endStr}`,
      { withCredentials: true }
    ).pipe(
      timeout(8000),
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to load booked dates:', error);
        return throwError(error);
      })
    );
  }
}
