import { Hospital } from "./hospital.model";

interface _MedicoUser {
    _id: string,
    nombre: string,
    img: string,
}

export class Medico {
    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _MedicoUser, //se pone ? dado que al momento de crear el hospital no tengo el usuario
        public hospital?: Hospital,
    ) {}
}