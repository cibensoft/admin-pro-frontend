import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(private hospitalService: HospitalService, private modalImagenService: ModalImagenService, private busquedasServices: BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales();

    // con esta subscription se espera a que algo cambie para poder disparar el evento de cargar hospitales y que se pueda visualizar la foto correspondiente y recien cambiada
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarHospitales());
  }

  //Se usa el onDestroy para no mantener activa la subscription una vez que se cierra y abre la pagina
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(hospitales => {
      this.hospitales = hospitales;
      this.cargando = false;
    })
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre).subscribe(resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
    })
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.eliminarHospital(hospital._id).subscribe(resp => {
      this.cargarHospitales();
      Swal.fire('Eliminado', 'Se elimino' + hospital.nombre, 'success');
    })
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      inputLabel: 'Creacion de Hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    })

    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value).subscribe((resp: any) => {
        this.hospitales.push(resp.hospital)
      })
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img)
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarHospitales();
    }
    this.busquedasServices.buscar('hospitales', termino).subscribe(resp => {
      this.hospitales = resp;
    })
  }

}
