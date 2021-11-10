import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
// Se puede importar el AppRoutingModule o impoprtar el RouterModule
// import { AppRoutingModule } from '../app-routing.module';//Este modulo ya esta cargado en memoria ya que lo importe
// //en app-module, asi que en este caso simplemente lo va a volver a utilizar, no es que lo importa dos veces
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    // AppRoutingModule
    RouterModule
  ]
})
export class PagesModule { }