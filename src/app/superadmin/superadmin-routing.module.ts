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
import { MonitoreoSemanalComponent } from './pages/monitoreo-semanal/monitoreo-semanal.component';


const routes: Routes =  [
  {
    path:'',
    children:[
      {path:'dashboard', component: DashboardComponent, data: { title: 'Dashboard', icon: 'LayoutDashboard', color: 'text-blue-700', showInMenu: true }},
      {path:'equipo', component: EquipoComponent, data: { title: 'Equipo', icon: 'Users', color: 'text-[#ff834d]', showInMenu: true }},
      {path:'historia-clinica/:id', component: HistoriaClinicaComponent, data: { title: 'Historia Clinica', showInMenu: false }},
      {path:'paciente', component: PacienteComponent, data: { title: 'Paciente', icon: 'UserRound', color: 'text-[#2EBBEE]', showInMenu: true }},
      {path:'add-admin', component: AddAdminComponent},
      {path:'foro', component: ForoComponent, data: { title: 'Foro', icon: 'MessageCircle', color: 'text-[#FCBD1B]', showInMenu: true }},
      {path:'perfil', component: PerfilComponent},
      {path:'monitoreo/:id', component: MonitoreoSemanalComponent, data: { title: 'Monitoreo',  showInMenu: false }},
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
