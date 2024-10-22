import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { CalificacionComponent } from './pages/calificacion/calificacion.component';
import { AddHijoComponent } from './pages/add-hijo/add-hijo.component';
import { ListHijoComponent } from './pages/list-hijo/list-hijo.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PerfilPadreComponent } from './pages/perfil-padre/perfil-padre.component';

import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    CalificacionComponent,
    AddHijoComponent,
    ListHijoComponent,
    InicioComponent,
    PerfilPadreComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UsuarioRoutingModule,
    SharedModule
  ]
})
export class UsuarioModule { }
