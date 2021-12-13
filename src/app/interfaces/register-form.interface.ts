//Las interfaces sirven para forzar que un objeto tenga cierta forma. Solo sirven para ayuda a la hora de desarrollar dado que cuando se compila el codigo a js, las mismas
//desaparecen
export interface RegisterForm {
    nombre: string;
    email: string;
    password: string;
    password2: string;
    terminos: boolean;
}
