import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { LoginDTO, RegisterDTO } from '../../models/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private backupApiUrl = environment.backupApiUrl;

    constructor(private http: HttpClient)
    {

    }

    login(email: string, password: string): Observable<any>
    {
      const user: LoginDTO =
      {
        email,
        password
      }
      return this.http.post<any>(`${this.apiUrl}/Auth/login`, user, { withCredentials: true })
        .pipe(
          timeout(10000),
          catchError((error: HttpErrorResponse) => {
            // Fallback to backup API
            return this.http.post<any>(`${this.backupApiUrl}/Auth/login`, user, { withCredentials: true })
              .pipe(
                timeout(8000),
                catchError((err: HttpErrorResponse) => {
                  return throwError(() => (err.error?.message || 'Login failed'));
                })
              );
          })
        );
    }

    me():Observable<any>
    {
      return this.http.get<any>(`${this.apiUrl}/Auth/me`, { withCredentials: true })
        .pipe(
          timeout(10000),
          catchError((error: HttpErrorResponse) => {
            // Fallback to backup API
            return this.http.get<any>(`${this.backupApiUrl}/Auth/me`, { withCredentials: true })
              .pipe(
                timeout(6000),
                catchError((err: HttpErrorResponse) => {
                  return throwError(() => (err.error?.message || 'Failed to load user'));
                })
              )
          })
        )
    }

    register(email: string, password: string): Observable<any>
    {
      const user: RegisterDTO =
      {
        email,
        password
      }
      return this.http.post<any>(`${this.apiUrl}/Auth/register`, user, { withCredentials: true })
        .pipe(
          timeout(10000),
            catchError((error: HttpErrorResponse) => {
            // Fallback to backup API
            return this.http.post<any>(`${this.backupApiUrl}/Auth/register`, user, { withCredentials: true })
              .pipe(
                timeout(8000),
                catchError((err: HttpErrorResponse) => {
                  return throwError(() => (err.error?.message || 'Registration failed'));
                })
              );
          })
        );
    }

    getAllUsers(): Observable<any>
    {
      return this.http.get<any>(`${this.apiUrl}/Auth/Users`, { withCredentials: true })
        .pipe(
          timeout(10000),
          catchError((error: HttpErrorResponse) => {
            // Fallback to backup API
            return this.http.get<any>(`${this.backupApiUrl}/Auth/Users`, { withCredentials: true })
          })
        )
    }
}

