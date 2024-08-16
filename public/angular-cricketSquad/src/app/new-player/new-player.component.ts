import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GenericResponse } from '../../dto/generic-response';
import { TeamDataService } from '../team-data.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private _service: TeamDataService, private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.newPlayerForm = new FormGroup({
      name: new FormControl,
      age: new FormControl,
      yearJoined: new FormControl,
    })
  }
  public addNewPlayer(form: FormGroup) {
    const paramName = environment.teamIdParamName;
    const teamId: string = this._activatedRoute.snapshot.params[paramName]
    const player = {
      name: form.value.name,
      age: form.value.age,
      yearJoined: form.value.yearJoined,
    }
    this._service.newPlayer(teamId, player).subscribe(response => {
      this.response = response;
      console.log(response)
      form.reset();
    })
  }
}
