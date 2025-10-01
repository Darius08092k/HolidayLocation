import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../enviroment/enviroment';
import { Observable } from 'rxjs';
import { Property } from '../Models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiURL = environment.apiUrl;

  getProperties(): Observable<Property[]>  {
    return this.http.get<Property[]>(`${this.apiURL}/PropertyAPI`)
  }

  getPropertyById(id: number): Observable<Property>  {
    return this.http.get<Property>(`${this.apiURL}/PropertyAPI/${id}`);
  }

  createProperty(property: any): Observable<Property>  {
    return this.http.post<Property>(`${this.apiURL}/PropertyAPI`, property);
  }

  constructor(private http: HttpClient) { }
}
