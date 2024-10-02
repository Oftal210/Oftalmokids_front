import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { CalificacionComponent } from './pages/calificacion/calificacion.component';

@NgModule({
  declarations: [
    CalificacionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule { }
