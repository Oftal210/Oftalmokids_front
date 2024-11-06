import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './pages/inicio/inicio.component';
import { CalificacionComponent } from './pages/calificacion/calificacion.component';
import { ListHijoComponent } from './pages/list-hijo/list-hijo.component';
import { PerfilPadreComponent } from './pages/perfil-padre/perfil-padre.component';


const routes: Routes =  [
  {
    path:'',
    children:[
      {path:'foro', component: InicioComponent, data: { title: 'Foro', icon: 'MessageSquareText', color: 'text-[#ff834d]', showInMenu: true } },
      {path:'dashboardd', component: CalificacionComponent, data: { title: 'Dashboard', icon: 'fa-solid fa-chart-pie', showInMenu: true } },
      {path:'hijo', component: ListHijoComponent, data: { title: 'Hijo', icon: 'ContactRound', color: 'text-[#2EBBEE]', showInMenu: true } },
      {path:'calificacion', component: CalificacionComponent},
      {path:'perfil', component: PerfilPadreComponent},
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class UsuarioRoutingModule { 
  static getRoutes(): Routes{
    return routes;
  }
}
