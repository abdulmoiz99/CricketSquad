import { Component, OnInit } from '@angular/core';
import { TeamDataService } from '../team-data.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorldCupWonComponent } from '../world-cup-won/world-cup-won.component';
import { environment } from '../../environments/environment';
import { GenericResponse } from '../../dto/generic-response';
import { Team } from '../../models/team';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, WorldCupWonComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  teamResponse!: GenericResponse<Team>;
  isAuthorized: boolean = true;
  constructor(private _activatedRoute: ActivatedRoute, private _teamDataService: TeamDataService) { }

  ngOnInit(): void {
    this.isAuthorized = sessionStorage.getItem(environment.token) ? true : false
    if (this.isAuthorized) {
      this.getTeamData()
    }
  }
  getTeamData(): void {
    const teamId: String = this._activatedRoute.snapshot.params["teamId"]
    this._teamDataService.getTeam(teamId).subscribe(teamResponse => {
      this.teamResponse = teamResponse
    })
  }
}
