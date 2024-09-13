export class LoginResponse {
    #token!: string;
    get token() { return this.#token; }
}