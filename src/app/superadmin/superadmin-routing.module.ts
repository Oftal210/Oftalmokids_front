import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { HistoriaClinicaComponent } from './pages/historia-clinica/historia-clinica.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AddAdminComponent } from './pages/add-admin/add-admin.component';
import { ForoComponent } from './pages/foro/foro.component';

const routes: Routes =  [
  {
    path:'',
    children:[
      {path:'dashboard', component: DashboardComponent, data: { title: 'Dashboard', icon: 'fa-solid fa-chart-pie', showInMenu: true }},
      {path:'equipo', component: EquipoComponent, data: { title: 'Equipo', icon: 'fa-solid fa-chart-pie', showInMenu: true }},
      {path:'historia-clinica', component: HistoriaClinicaComponent},
      {path:'paciente', component: PacienteComponent, data: { title: 'Paciente', icon: 'fa-solid fa-chart-pie', showInMenu: true }},
      {path:'add-admin', component: AddAdminComponent},
      {path:'foro', component: ForoComponent, data: { title: 'Foro', icon: 'fa-solid fa-chart-pie', showInMenu: true }},
      {path:'perfil', component: PerfilComponent, data: { title: 'Perfil', icon: 'fa-solid fa-chart-pie', showInMenu: true }},
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class SuperadminRoutingModule {
  static getRoutes(): Routes{
    return routes;
  }
 }
