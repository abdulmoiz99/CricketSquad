import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GenericResponse } from '../dto/generic-response';

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

  public login(user: object): Observable<GenericResponse<string>> {
    return this._httpClient.post<GenericResponse<string>>(`${this._baseUrl}/users/login`, user)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse): Observable<GenericResponse<string>> {
    const errorResponse = new GenericResponse<string>(
      false,
      error.error.message || 'An unknown error occurred',
      ""
    );

    return of(errorResponse);
  }
}
