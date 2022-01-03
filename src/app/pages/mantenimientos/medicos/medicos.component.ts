import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs: Subscription;

  constructor(private medicoService: MedicoService, private modalImagenService: ModalImagenService, private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();

    // con esta subscription se espera a que algo cambie para poder disparar el evento de cargar medicos y que se pueda visualizar la foto correspondiente y recien cambiada
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => {
        console.log(img);
        this.cargarMedicos()
      });
  }

  //Se usa el onDestroy para no mantener activa la subscription una vez que se cierra y abre la pagina
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe(medicos => {
      this.medicos = medicos;
      this.cargando = false;
    })
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img)
  }

  buscarMedico(termino: string) {
    if (termino.length === 0) {
      return this.cargarMedicos();
    }

    this, this.busquedaService.buscar('medicos', termino).subscribe(resp => {
      this.medicos = resp;
    })
  }

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: 'Borrar medico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id).subscribe(resp => {
          this.cargarMedicos();
          Swal.fire(
            'Medico borrado',
            `${medico.nombre} fue eliminado correctamente`,
            'success'
          )
        }
        )
      };
    })
  }

}
