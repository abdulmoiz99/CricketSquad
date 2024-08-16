import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { GenericResponse } from '../dto/generic-response';
import { Team } from '../models/team';
import { TeamsResponse } from '../dto/team-response';

@Injectable({
  providedIn: 'root'
})
export class TeamDataService {
  _baseUrl: String = environment.baseUrl;

  constructor(private _httpClient: HttpClient) { }

  public getTeams(offset: number, limit: number): Observable<GenericResponse<TeamsResponse>> {
    return this._httpClient.get<GenericResponse<TeamsResponse>>(`${this._baseUrl}/teams?offset=${offset}&count=${limit}`)
  }
  public getTeam(teamId: String): Observable<GenericResponse<Team>> {
    return this._httpClient.get<GenericResponse<Team>>(`${this._baseUrl}/teams/${teamId}`);
  }
  public deleteTeam(teamId: String): Observable<GenericResponse<Team>> {
    return this._httpClient.delete<GenericResponse<Team>>(`${this._baseUrl}/teams/${teamId}`);
  }
  public newTeam(team: object): Observable<GenericResponse<String>> {
    return this._httpClient.post<GenericResponse<String>>(`${this._baseUrl}/teams`, team)
  }
  public newPlayer(player: object): Observable<GenericResponse<String>> {
    return this._httpClient.post<GenericResponse<String>>(`${this._baseUrl}/teams/66a59c334ac250bb43a9d718/players`, player)
  }
}
