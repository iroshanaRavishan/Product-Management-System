import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserResponse } from '../models/UserResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();
  
  base_url: string = "https://localhost:7238";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<UserResponse>{ 
    return this.http.post<UserResponse>(`${this.base_url}/api/auth/login`, { email, password }).pipe(
      tap(() => {
        this.loggedIn.next(true);
      }),
      catchError(error => {
        console.error('Login error', error);
        return throwError(error);
      })
    );
  }
}
