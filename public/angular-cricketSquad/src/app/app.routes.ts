import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TeamsComponent } from './teams/teams.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { TeamComponent } from './team/team.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NewTeamComponent } from './new-team/new-team.component';
import { NewPlayerComponent } from './new-player/new-player.component';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "teams", component: TeamsComponent },
    { path: "teams/new", component: NewTeamComponent },
    { path: "team/:teamId", component: TeamComponent },
    { path: "team/:teamId/new", component: NewPlayerComponent },
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    { path: "**", component: ErrorPageComponent },
];
