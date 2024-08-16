import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
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
      .pipe(
        catchError(this.handleError)
      );
  }
  public getTeam(teamId: String): Observable<GenericResponse<Team>> {
    return this._httpClient.get<GenericResponse<Team>>(`${this._baseUrl}/teams/${teamId}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  public deleteTeam(teamId: String): Observable<GenericResponse<Team>> {
    return this._httpClient.delete<GenericResponse<Team>>(`${this._baseUrl}/teams/${teamId}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  public newTeam(team: object): Observable<GenericResponse<String>> {
    return this._httpClient.post<GenericResponse<String>>(`${this._baseUrl}/teams`, team)
      .pipe(
        catchError(this.handleError)
      );
  }
  public newPlayer(player: object): Observable<GenericResponse<String>> {
    return this._httpClient.post<GenericResponse<String>>(`${this._baseUrl}/teams/66a59c334ac250bb43a9d718/players`, player)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse): Observable<GenericResponse<any>> {
    const errorResponse = new GenericResponse<any>(
      false,
      error.error.message || 'An unknown error occurred',
      ""
    );

    return of(errorResponse);
  }
}
