import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TeamDataService } from '../team-data.service';
import { CommonModule } from '@angular/common';
import { GenericResponse } from '../../dto/generic-response';

@Component({
  selector: 'app-new-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-team.component.html',
  styleUrl: './new-team.component.css'
})
export class NewTeamComponent {
  newTeamForm!: FormGroup;
  loginSuccessful: Boolean = false;
  response!: GenericResponse<String>;


  constructor(private _service: TeamDataService) { }
  ngOnInit(): void {
    this.newTeamForm = new FormGroup({
      country: new FormControl,
      yearEstablished: new FormControl,
      totalWorldCupWon: new FormControl,
    })
  }
  public createNewTeam(form: FormGroup) {
    const team = {
      country: form.value.country,
      yearEstablished: form.value.yearEstablished,
      totalWorldCupWon: form.value.totalWorldCupWon,
    }
    this._service.newTeam(team).subscribe(response => {
      this.response = response;
    })
  }
}
