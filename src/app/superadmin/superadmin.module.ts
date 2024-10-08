import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SuperadminRoutingModule } from './superadmin-routing.module';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { HistoriaClinicaComponent } from './pages/historia-clinica/historia-clinica.component';
import { AddAdminComponent } from './pages/add-admin/add-admin.component';
import { ForoComponent } from './pages/foro/foro.component';
import { AddPacienteComponent } from './pages/add-paciente/add-paciente.component';

import { SharedModule } from '../shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    EquipoComponent,
    PacienteComponent,
    PerfilComponent,
    HistoriaClinicaComponent,
    AddAdminComponent,
    ForoComponent,
    AddPacienteComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SuperadminRoutingModule,
    SharedModule
  ]
})
export class SuperadminModule { }
