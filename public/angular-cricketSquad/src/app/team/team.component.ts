import { Component, OnInit } from '@angular/core';
import { TeamDataService } from '../team-data.service';
import { Team } from '../teams/teams.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorldCupWonComponent } from '../world-cup-won/world-cup-won.component';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, WorldCupWonComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  team!: Team;

  constructor(private _activatedRoute: ActivatedRoute, private _teamDataService: TeamDataService) { }

  ngOnInit(): void {
    const teamId: String = this._activatedRoute.snapshot.params["teamId"]
    this._teamDataService.getTeam(teamId).subscribe(team => {
      this.team = team
    })
  }

}
