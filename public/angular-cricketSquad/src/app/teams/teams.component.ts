import { Component, OnInit } from '@angular/core';
import { TeamDataService } from '../team-data.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


export class TeamsResponse {
  #totalCount!: number;
  #teams!: [Team]
  get totalCount() { return this.#totalCount; }
  get teams() { return this.#teams; }
}

export class Team {
  #_id!: string;
  #country!: string;
  #yearEstablished!: string;
  #totalWorldCupWon!: number;
  #players!: Players[];
  get _id() { return this.#_id; }
  get country() { return this.#country; }
  get yearEstablished() { return this.#yearEstablished; }
  get totalWorldCupWon() { return this.#totalWorldCupWon; }
  get players() { return this.#players; }
}
class Players {
  #_id!: string;
  #name!: string;
  #age!: number;
  #yearJoined!: number;

  get _id() { return this.#_id; }
  get name() { return this.#name; }
  get age() { return this.#age; }
  get yearJoined() { return this.#yearJoined; }
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
