import { Component, OnInit } from '@angular/core';
import { TeamDataService } from '../team-data.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GenericResponse } from '../../dto/generic-response';
import { TeamsResponse } from '../../dto/team-response';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements OnInit {
  teamResponse: GenericResponse<TeamsResponse> | undefined;
  offset: number = environment.offset;
  limit: number = environment.pageLimit;
  isNextDisable: boolean = false;
  isPreviousDisable: boolean = true;

  constructor(private _teamDataService: TeamDataService) { }

  ngOnInit(): void {
    this.updatePageData();
  }

  private getTeamsData(): void {
    this._teamDataService.getTeams(this.offset, this.limit).subscribe(teams => {
      this.teamResponse = teams;
      this.updateButtons();
    });
  }

  private updatePageData(): void {
    this.getTeamsData();
  }

  private updateButtons(): void {
    if (this.teamResponse) {
      this.isPreviousDisable = this.offset === 0;
      this.isNextDisable = this.teamResponse.data.totalCount <= this.offset + this.limit;
    }
  }

  public nextTeams(): void {
    if (!this.isNextDisable) {
      this.offset += this.limit;
      this.updatePageData();
    }
  }

  public previousTeams(): void {
    if (!this.isPreviousDisable) {
      this.offset -= this.limit;
      this.updatePageData();
    }
  }
  deleteTeam(teamId: string): void {
    // return this.http.delete<any>(`${this.apiUrl}/teams/${teamId}`);
  }
}
