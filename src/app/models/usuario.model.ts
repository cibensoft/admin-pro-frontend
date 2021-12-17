import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export class Usuario {
    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public uid?: string,//el signo de interrogacion indica que la propiedad es opcional
    ) { }

    imprimirUsuario() {
        console.log(this.nombre);
    }

    get imagenUrl() {
        if (this.img.includes('https')) {
            console.log(this.img);
            return this.img;
        }
        if (this.img) {
            return `${base_url}/upload/usuarios/${this.img}`;
        }
        else {
            return `${base_url}/upload/usuarios/no-image`;
        }
    }
}