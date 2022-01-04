import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicosService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    //this.activatedRoute.params.subscribe(params=>{//en params vienen los parametros
    this.activatedRoute.params.subscribe(({ id }) => {
      //como yo se que en params viene el parametro, entonces desestructuro para obtener el "id". 
      //El nombre "id" es el que defini en pages.routing.ts 
      //{ path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Mantenimiento de medicos' } },   
      this.cargarMedico(id);
    })

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    })
    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges.subscribe(hospitalId => {
      //se podria usar find o filter, pero el find es mas eficiente ya que al encontrar uno no sigue buscando
      this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
    })
  }

  private cargarMedico(id: string) {

    if (id === 'nuevo') {
      return;
    }

    this.medicosService.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe(medico => {

        if (!medico) {//este caso se daria si en la url se pone un id que no existe
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }

        //obtengo el nombre del medico y el id del hospital por desestructuracion. 
        //El id del hospital se obtiene de esa forma ya que esta dentro de otro objeto(hospital)
        const { nombre, hospital: { _id } } = medico;
        console.log(nombre, _id);
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      })
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
    })
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;
    if (this.medicoSeleccionado) {
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicosService.actualizarMedico(data).subscribe(resp => {
        console.log(resp);
        Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
      })
    }
    else {
      //crear
      this.medicosService.crearMedico(this.medicoForm.value).subscribe((resp: any) => {
        Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
      })
    }
  }

}
