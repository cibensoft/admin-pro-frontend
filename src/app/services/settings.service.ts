import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');

  constructor() { 
    //Se setea el tema
    const url = localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';//si no hay nada seteado en localstorage, asigno tema por defecto
    this.linkTheme.setAttribute('href', url); //<--vanilla javascript
  }

  changeTheme(theme: string) {
    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme.setAttribute('href', url); //<--vanilla javascript
    localStorage.setItem('theme', url);
    this.checkCurrentTheme();
  }

  checkCurrentTheme() {

    const links=document.querySelectorAll('.selector');//tomo todos los elementos que tengan la clase 'selector'

    links.forEach(elem => {
      elem.classList.remove('working');//elimino la clase working de todos
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme.getAttribute('href');

      if (btnThemeUrl === currentTheme) {
        elem.classList.add('working');
      }
    })
  }
}
