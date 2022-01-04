import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {
    return new Promise<void>(resolve => {//Si no le pongo el "void" marca como error la linea del resolve() pero aun asi funciona igual
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '977894616798-aiurdnnvlvdtrpdv7j41vrgj4b4vbpdb.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();//<-------aca marca error si no especifico que la promesa retorna un void. Aunque marca el error, permite el funcionamiento de la app
      });
    })
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));//en el local storage solo se pueden almacenar strings por eso hay que convertir "menu" en un string
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    //TODO: Borrar menu

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    })
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;//Se pone img = '' para que el getter en el modelo usuario no de error en caso de que venga un usuario sin imagen
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        this.guardarLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError(error => of(false))//catchError atrapa el error que suceda en el flujo y regresa un valor. El "of" retorna un observable que resuelve lo que se le manda entre parentesis, en este caso "false"
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      )
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {//Tambien se podria crear una interface para asignarle el tipo a "data"
    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      )
  }

  loginGoogle(token) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      )
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)//se podrian implementar interceptors para agregar los headers en todas las peticiones http que lo requieran
      .pipe(
        //delay(5000),
        map(resp => {//lo que se hace aca es cambiar el objeto que viene en la respuesta por un modelo de tipo usuario.
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
          );

          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {//Tambien se podria crear una interface para asignarle el tipo a "data"
    // data = {
    //   ...data,
    //   role: this.usuario.role
    // }

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)
  }
}
