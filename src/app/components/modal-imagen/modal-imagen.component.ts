import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenASubir: File;
  public imgTemp: any = null;

  constructor(public modalImageService: ModalImagenService, public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImageService.cerrarModal();
  }

  cambiarImagen(file: File) {
    this.imagenASubir = file;

    if (!file) {
      return this.imgTemp = null
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    const id = this.modalImageService.id;
    const tipo = this.modalImageService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenASubir, tipo, id)
      .then(img => {
        Swal.fire('Guardado', 'Imagen actualizada', 'success');
        this.modalImageService.nuevaImagen.emit(img)
        this.cerrarModal();
      }).catch(err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })
  }

}
