import { Component, OnInit } from '@angular/core';
import { TeamDataService } from '../team-data.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorldCupWonComponent } from '../world-cup-won/world-cup-won.component';
import { GenericResponse } from '../../dto/generic-response';
import { Team } from '../../models/team';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, WorldCupWonComponent, RouterLink],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  teamResponse!: GenericResponse<Team>;
  isAuthorized: boolean = true;
  constructor(private _activatedRoute: ActivatedRoute, private _teamDataService: TeamDataService) { }

  ngOnInit(): void {
    this.getTeamData()
  }
  getTeamData(): void {
    const paramName = environment.teamIdParamName;
    const teamId: String = this._activatedRoute.snapshot.params[paramName]
    this._teamDataService.getTeam(teamId).subscribe(teamResponse => {
      this.teamResponse = teamResponse
    })
  }
  deleteTeam(): void {
    const paramName = environment.teamIdParamName;
    const teamId: String = this._activatedRoute.snapshot.params[paramName]
    this._teamDataService.deleteTeam(teamId).subscribe(teamResponse => {
      console.log(teamResponse)
    })
  }
}
