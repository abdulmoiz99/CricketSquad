import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  searchForm!: FormGroup;
  constructor(private _service: UserDataService) { }
  ngOnInit(): void {
    this.searchForm = new FormGroup({
      name: new FormControl,
      username: new FormControl,
      password: new FormControl,
    })
  }
  public search(form: FormGroup) {
    const user = {
      name: form.value.name,
      username: form.value.username,
      password: form.value.password,
    }

    this._service.registerUser(user).subscribe(response => {
      console.log(response)
    })

  }
}
