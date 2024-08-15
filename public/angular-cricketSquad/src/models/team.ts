import { Player } from "./player";

export class Team {
    #_id!: string;
    #country!: string;
    #yearEstablished!: string;
    #totalWorldCupWon!: number;
    #players!: Player;
    get _id() { return this.#_id; }
    get country() { return this.#country; }
    get yearEstablished() { return this.#yearEstablished; }
    get totalWorldCupWon() { return this.#totalWorldCupWon; }
    get players() { return this.#players; }
  }