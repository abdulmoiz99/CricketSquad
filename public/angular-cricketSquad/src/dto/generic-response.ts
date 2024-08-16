export class GenericResponse<Type> {
    #success!: boolean;
    #message!: string;
    #data!: Type;

    constructor(success: boolean, message: string, data: Type) {
        this.#success = success;
        this.#message = message;
        this.#data = data;
    }

    get success() { return this.#success; }
    get message() { return this.#message; }
    get data() { return this.#data; }
}
