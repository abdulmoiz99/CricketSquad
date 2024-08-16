import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../authentication.service';
import { GenericResponse } from '../../dto/generic-response';
import { LoginResponse } from '../../dto/login-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginResponse!: GenericResponse<LoginResponse>;
  constructor(
    private _userService: UserDataService,
    private _authenticationService: AuthenticationService,
    private _router: Router) { }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl,
      password: new FormControl,
    })
  }
  public login(form: FormGroup) {
    if (this.loginForm.invalid) {
      return;
    }

    const userCredentials = this.loginForm.value;
    this._userService.login(userCredentials).subscribe(response => {
      this.loginResponse = response;

      if (response.success) {
        this._authenticationService.logIn(response.data.token);
        this._router.navigate([environment.homePageURL]);
      }
    });
  }
}
