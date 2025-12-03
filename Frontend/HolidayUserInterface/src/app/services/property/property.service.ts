import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { Property } from '../../../Models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiURL = environment.apiUrl;
  private backupApiURL = environment.backupApiUrl;

  getProperties(): Observable<Property[]>  {
    return this.http.get<Property[]>(`${this.apiURL}/PropertyAPI`, { withCredentials: true })
      .pipe(
        timeout(8000),
        retry(1),
        catchError((error: HttpErrorResponse) => {
          console.error('Primary API failed, trying backup...', error);
          return this.http.get<Property[]>(`${this.backupApiURL}/PropertyAPI`, { withCredentials: true })
            .pipe(
              timeout(5000),
              catchError(this.handleError)
            );
        })
      );
  }

  getPropertyById(id: number): Observable<Property>  {
    return this.http.get<Property>(`${this.apiURL}/PropertyAPI/${id}`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  getImageUrl(villaFolder: string, imageName: string): string {
  return `${environment.imageUrl}/${villaFolder}/${imageName}`;
}

updatePropertyImageUrls(properties: Property[]): Property[] {
  return properties.map(property => ({
    ...property,
    imageUrl: property.imageUrl.startsWith('http')
      ? property.imageUrl
      : `${environment.imageUrl}${property.imageUrl}`
  }));
}

  createProperty(property: any): Observable<Property>  {
    return this.http.post<Property>(`${this.apiURL}/PropertyAPI`, property, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProperty(id: number, property: any): Observable<Property>  {
    return this.http.put<Property>(`${this.apiURL}/PropertyAPI/${id}`, property, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProperty(id: number): Observable<any>  {
    return this.http.delete<any>(`${this.apiURL}/PropertyAPI/${id}`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAvailableImages(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/PropertyAPI/images`, { withCredentials: true })
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
    console.log('Testing localhost connection...');
    return this.http.get(`${this.apiURL}/PropertyAPI`, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.log('Localhost failed, trying backup API...');
          return this.http.get(`${this.backupApiURL}/PropertyAPI`, { withCredentials: true })
            .pipe(
              catchError((backupError) => {
                console.log('Both APIs failed:', { primary: error, backup: backupError });
                return throwError(() => 'All APIs failed');
              })
            );
        })
      );
  }

  constructor(private http: HttpClient) { }
}
