import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(private _authenticationService: AuthenticationService) { }
  isLoggedIn(): boolean {
    return this._authenticationService.isLoggedIn()
  }
  logout(): void {
    this._authenticationService.logout()
  }
}
