import { Team } from "../models/team";

export class TeamsResponse {
    #totalCount!: number;
    #teams!: [Team]
    get totalCount() { return this.#totalCount; }
    get teams() { return this.#teams; }
}