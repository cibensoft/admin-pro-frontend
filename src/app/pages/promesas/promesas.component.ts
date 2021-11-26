import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: []
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // const promesa = new Promise((resolve, reject) => {
    //   if (false) {
    //     resolve('Hola mundo');
    //   }
    //   else {
    //     reject('Algo salio mal');
    //   }

    // });
    // promesa.then((mensaje) => {
    //   console.log(mensaje);
    // })
    //   .catch(error => console.log('Error en mi promesa', error))
    // console.log('Fin del init');

    //this.getUsuarios();

    this.getUsuarios().then(usuarios => {
      console.log('usuarios ',usuarios);
    })
  }

  getUsuarios() {
    // fetch('https://reqres.in/api/users').then(resp => {
    //   console.log('tengo data');
    //   resp.json().then(body => console.log(body));
    // });

    // fetch('https://reqres.in/api/users')
    //   .then(resp => resp.json())
    //   .then(body => console.log(body.data));

    // const promesa = new Promise(resolve => {
    //   fetch('https://reqres.in/api/users')
    //     .then(resp => resp.json())
    //     .then(body => resolve(body.data));
    // });
    // return promesa;

    //hace exactamente lo mismo que el codigo anterior
    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data));
    });
  }
}
