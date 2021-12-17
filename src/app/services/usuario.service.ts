import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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

  get uid(): string {
    return this.usuario.uid || '';
  }

  googleInit() {
    return new Promise<void>(resolve => {//Si no le pongo el "void" marca como error la linea del resolve() pero aun asi funciona igual
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '977894616798-aiurdnnvlvdtrpdv7j41vrgj4b4vbpdb.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();//<-------ERROR!!!!
      });
    })
  }

  logout() {
    localStorage.removeItem('token');

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
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => of(false))//catchError atrapa el error que suceda en el flujo y regresa un valor. El "of" retorna un observable que resuelve lo que se le manda entre parentesis, en este caso "false"
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {//Tambien se podria crear una interface para asignarle el tipo a "data"
    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    })
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  loginGoogle(token) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }
}
