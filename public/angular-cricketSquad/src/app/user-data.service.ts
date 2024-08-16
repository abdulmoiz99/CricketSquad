import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GenericResponse } from '../dto/generic-response';
import { LoginResponse } from '../dto/login-response';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private _baseUrl: string = environment.baseUrl;

  constructor(private _httpClient: HttpClient) { }

  public registerUser(user: object): Observable<GenericResponse<string>> {
    return this._httpClient.post<GenericResponse<string>>(`${this._baseUrl}/users`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  public login(user: object): Observable<GenericResponse<LoginResponse>> {
    return this._httpClient.post<GenericResponse<LoginResponse>>(`${this._baseUrl}/users/login`, user)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse): Observable<GenericResponse<any>> {
    const errorResponse = new GenericResponse<any>(
      false,
      error.error.message || 'An unknown error occurred',
      ""
    );
    return of(errorResponse);
  }
}
