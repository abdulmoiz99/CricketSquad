import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { GenericResponse } from '../dto/generic-response';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  _baseUrl: String = environment.baseUrl;

  constructor(private _httpClient: HttpClient) { }

  public registerUser(user: object): Observable<GenericResponse<String>> {
    return this._httpClient.post<GenericResponse<String>>(`${this._baseUrl}/users`, user)
  }

  public login(user: object): Observable<any> {
    return this._httpClient.post(`${this._baseUrl}/users/login`, user)
  }
}
