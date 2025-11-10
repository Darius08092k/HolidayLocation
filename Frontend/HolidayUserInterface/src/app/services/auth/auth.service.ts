import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, timeout, tap } from 'rxjs/operators';
import { LoginDTO, RegisterDTO, User } from '../../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private backupApiUrl = environment.backupApiUrl;

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    public currentUser$ = this.currentUserSubject.asObservable();
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private http: HttpClient)
    {

    }

    get currentUser(): User | null {
      return this.currentUserSubject.value;
    }

    get isAuthenticated(): boolean {
      return this.isAuthenticatedSubject.value;
    }

    checkAuthStatus(): Observable<any> {
      return this.me().pipe(
        tap({
          next: (user) => {
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          },
          error: () => {
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
          }
        })
      );
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
          tap(() => {
            this.checkAuthStatus().subscribe();
          }),
          catchError((error: HttpErrorResponse) => {
            return this.http.post<any>(`${this.backupApiUrl}/Auth/login`, user, { withCredentials: true })
              .pipe(
                timeout(8000),
                tap(() => {
                  this.checkAuthStatus().subscribe();
                }),
                catchError((err: HttpErrorResponse) => {
                  this.currentUserSubject.next(null);
                  this.isAuthenticatedSubject.next(false);
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

    logout(): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/Auth/logout`, {}, { withCredentials: true })
        .pipe(
          timeout(5000),
          tap(() => {
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
          }),
          catchError((error: HttpErrorResponse) => {
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
            return throwError(() => (error.error?.message || 'Logout failed'));
          })
        );
    }

    register(email: string, password: string, confirmPassword: string): Observable<any>
    {
      const user: RegisterDTO =
      {
        email,
        password,
        confirmPassword
      }
      return this.http.post<any>(`${this.apiUrl}/Auth/register`, user, { withCredentials: true })
        .pipe(
          timeout(10000),
          tap(() => {
            this.checkAuthStatus().subscribe();
          }),
            catchError((error: HttpErrorResponse) => {
            return this.http.post<any>(`${this.backupApiUrl}/Auth/register`, user, { withCredentials: true })
              .pipe(
                timeout(8000),
                tap(() => {
                  this.checkAuthStatus().subscribe();
                }),
                catchError((err: HttpErrorResponse) => {
                  return throwError(() => (err.error?.message || 'Registration failed'));
                })
              );
          })
        );
    }

    getAllUsers(): Observable<User[]>
    {
      return this.http.get<User[]>(`${this.apiUrl}/Auth/Users`, { withCredentials: true })
        .pipe(
          timeout(10000),
          catchError((error: HttpErrorResponse) => {
            return this.http.get<User[]>(`${this.backupApiUrl}/Auth/Users`, { withCredentials: true })
              .pipe(
                catchError((err: HttpErrorResponse) => {
                  return throwError(() => (err.error?.message || 'Failed to load users'));
                })
              )
          })
        )
    }

    updateUser(id: string, email: string, userName: string, phoneNumber: string, roles: string[]): Observable<any>
    {
      const user = {
        email: email,
        userName: userName,
        phoneNumber: phoneNumber,
        roles: roles
      };

      return this.http.put<any>(`${this.apiUrl}/Auth/EditUser/${id}`, user, { withCredentials: true })
        .pipe(
          timeout(10000),
          catchError((error: HttpErrorResponse) => {
            return throwError(() => (error.error?.message || 'Failed to update user'));
          })
        )
    }

    deleteUser(id: string): Observable<any>
    {
      return this.http.delete<any>(`${this.apiUrl}/Auth/DeleteUser/${id}`, { withCredentials: true })
        .pipe(
          timeout(10000),
          catchError((error: HttpErrorResponse) => {
            return throwError(() => (error.error?.message || 'Failed to delete user'));
          })
        )
    }
}
