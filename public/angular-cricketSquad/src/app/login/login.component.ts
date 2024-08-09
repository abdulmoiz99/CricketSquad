import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { response } from 'express';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(private _service: UserDataService) { }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl,
      password: new FormControl,
    })
  }
  public login(form: FormGroup) {
    const user = {
      username: form.value.username,
      password: form.value.password,
    }
    console.log(user)
    this._service.login(user).subscribe(response => {
      console.log(response)
    })
  }
}
