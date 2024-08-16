import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginSuccessful: Boolean = false;
  constructor(private _service: UserDataService) { }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl,
      password: new FormControl,
    })
  }
  public login(form: FormGroup) {
    this.loginSuccessful = false;
    const user = {
      username: form.value.username,
      password: form.value.password,
    }
    this._service.login(user).subscribe(response => {
      this.loginSuccessful = true;
      form.reset();
    })
  }
}
