import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GenericResponse } from '../../dto/generic-response';
import { TeamDataService } from '../team-data.service';

@Component({
  selector: 'app-new-player',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-player.component.html',
  styleUrl: './new-player.component.css'
})
export class NewPlayerComponent implements OnInit {
  newPlayerForm!: FormGroup;
  response!: GenericResponse<String>;

  constructor(private _service: TeamDataService) { }

  ngOnInit(): void {
    this.newPlayerForm = new FormGroup({
      name: new FormControl,
      age: new FormControl,
      yearJoined: new FormControl,
    })
  }
  public addNewPlayer(form: FormGroup) {
    const player = {
      name: form.value.name,
      age: form.value.age,
      yearJoined: form.value.yearJoined,
    }
    console.log(form.value)
    this._service.newPlayer(player).subscribe(response => {
      this.response = response;
      form.reset();
    })
  }
}
