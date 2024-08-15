export class GenericResponse<Type> {
    #success!: boolean;
    #message!: string;
    #data!: Type;
    get success() { return this.#success; }
    get message() { return this.#message; }
    get data() { return this.#data; }
}
