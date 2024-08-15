export class Player {
    #_id!: string;
    #name!: string;
    #age!: number;
    #yearJoined!: number;

    get _id() { return this.#_id; }
    get name() { return this.#name; }
    get age() { return this.#age; }
    get yearJoined() { return this.#yearJoined; }
}