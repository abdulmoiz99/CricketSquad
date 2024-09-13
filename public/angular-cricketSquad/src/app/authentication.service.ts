import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  getAuthToken(): string | null {
    return sessionStorage.getItem(environment.token);
  }

  isLoggedIn(): boolean {
    return this.getAuthToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem(environment.token);
  }
  logIn(authenticationToken: string): void {
    sessionStorage.setItem(environment.token, authenticationToken);
  }
}
