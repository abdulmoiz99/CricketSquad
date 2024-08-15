import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  getAuthToken(): String | null {
    return sessionStorage.getItem(environment.token)
  }
}
