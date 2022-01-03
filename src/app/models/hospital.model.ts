interface _HospitalUser {
    _id: string,
    nombre: string,
    img: string,
}

export class Hospital {
    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _HospitalUser, //se pone ? dado que al momento de crear el hospital no tengo el usuario
    ) {}
}