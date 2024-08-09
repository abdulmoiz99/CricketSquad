import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Team } from './teams/teams.component';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamDataService {
  _baseUrl: String = environment.baseUrl;

  constructor(private _httpClient: HttpClient) { }

  public getTeams(): Observable<Team[]> {
    return this._httpClient.get<Team[]>(`${this._baseUrl}/teams`)
  }
  public getTeam(teamId: String): Observable<Team> {
    return this._httpClient.get<Team>(`${this._baseUrl}/teams/${teamId}`)
  }
}
