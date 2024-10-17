import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CalificacionComponent } from './pages/calificacion/calificacion.component';
import { ListHijoComponent } from './pages/list-hijo/list-hijo.component';

const routes: Routes =  [
  {
    path:'',
    children:[
      {path:'dashboard', component: CalificacionComponent, data: { title: 'Dashboard', icon: 'fa-solid fa-chart-pie', showInMenu: true } },
      {path:'hijo', component: ListHijoComponent, data: { title: 'Hijo', icon: 'fa-solid fa-chart-pie', showInMenu: true } },
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
