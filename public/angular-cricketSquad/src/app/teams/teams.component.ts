import { Component, OnInit } from '@angular/core';
import { TeamDataService } from '../team-data.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Team } from '../../models/team';


export class TeamsResponse {
  #totalCount!: number;
  #teams!: [Team]
  get totalCount() { return this.#totalCount; }
  get teams() { return this.#teams; }
}

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})

export class TeamsComponent implements OnInit {

  teamResponse!: TeamsResponse;
  offset: number = 0;
  limit: number = 5;
  isNextDisable: Boolean = false;
  isPreviousDisable: Boolean = true;


  teams: Team[] = []

  constructor(private _teamDataService: TeamDataService) { }

  ngOnInit(): void {
    this.updatePageData();
  }
  private getTeamsData(): void {
    this._teamDataService.getTeams(this.offset, this.limit).subscribe(teams => {
      this.teamResponse = teams;
    });
  }
  private updatePageData(): void {
    this.getTeamsData();
    this.updateButtons();
  }
  private updateButtons(): void {
    this.isPreviousDisable = this.offset == 0
    this.isNextDisable = this.teamResponse.totalCount < this.offset + this.limit
  }
  public nextTeams(): void {
    if (!this.isNextDisable) {
      this.offset += this.limit;
      this.updatePageData();
    }
  }
  public previousTeams() {
    if (!this.isPreviousDisable) {
      this.offset -= this.limit;
      this.updatePageData()
    }
  }
}
