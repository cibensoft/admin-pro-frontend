import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { UsuarioService } from 'src/app/services/usuario.service';

declare const gapi: any; //Dado que estoy importando desde un script a "gapi", debo declararlo aca arriba

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  public formSubmitted = false;//para saber si el formulario se envio
  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  login() {
    //console.log(this.loginForm.value);
    //this.router.navigateByUrl('/');
    this.usuarioService.login(this.loginForm.value).subscribe(res => {
      if (this.loginForm.get('remember').value) {
        localStorage.setItem('email', this.loginForm.get('email').value);
      }
      else {
        localStorage.removeItem('email');
      }
      //Navegar al dashboard
      this.router.navigateByUrl('/');
    }, (err) => {
      Swal.fire('Error', err.error.msg, 'error');
    });
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp()
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(id_token).subscribe(resp => {
          //Navegar al dashboard
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          })
        });
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  async startApp() {

    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));

  }
}
