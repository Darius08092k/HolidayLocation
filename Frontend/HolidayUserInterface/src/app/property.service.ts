import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../enviroment/enviroment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Property } from '../Models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiURL = environment.apiUrl;
  private backupApiURL = environment.backupApiUrl;

  getProperties(): Observable<Property[]>  {
    return this.http.get<Property[]>(`${this.apiURL}/PropertyAPI`)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          console.error('Primary API failed, trying backup...', error);
          return this.http.get<Property[]>(`${this.backupApiURL}/PropertyAPI`)
            .pipe(
              catchError(this.handleError)
            );
        })
      );
  }

  getPropertyById(id: number): Observable<Property>  {
    return this.http.get<Property>(`${this.apiURL}/PropertyAPI/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createProperty(property: any): Observable<Property>  {
    return this.http.post<Property>(`${this.apiURL}/PropertyAPI`, property)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  testConnection(): Observable<any> {
    return this.http.get(`${this.apiURL}/PropertyAPI`)
      .pipe(
        catchError(() => {
          console.log('Trying backup API...');
          return this.http.get(`${this.backupApiURL}/PropertyAPI`);
        })
      );
  }

  constructor(private http: HttpClient) { }
}
