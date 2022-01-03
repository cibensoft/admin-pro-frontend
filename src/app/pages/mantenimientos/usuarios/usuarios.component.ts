import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private usuariosService: UsuarioService, private busquedasServices: BusquedasService, private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {
    this.cargarUsuarios();

    // con esta subscription se espera a que algo cambie para poder disparar el evento de cargar usuarios y que se pueda visualizar la foto correspondiente y recien cambiada
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => { this.cargarUsuarios() });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuariosService.cargarUsuarios(this.desde).subscribe(({ total, usuarios }) => {//estoy haciendo desestructuracion para que se obtenga el total y los usuarios de la respuesta
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    })
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    }
    else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedasServices.buscar('usuarios', termino).subscribe((resp: Usuario[]) => {
      this.usuarios = resp;
    })
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuariosService.uid) {
      return Swal.fire('Error', 'no puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuario(usuario).subscribe(resp => {
          this.cargarUsuarios();
          Swal.fire(
            'Usuario borrado',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          )
        }
        )
      };
    })
  }

  cambiarRole(usuario: Usuario) {
    this.usuariosService.guardarUsuario(usuario).subscribe(resp => {
      console.log(resp);
    })
  }

  abrirModal(usuario: Usuario) {
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
