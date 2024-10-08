import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CalificacionComponent } from './pages/calificacion/calificacion.component';
import { ListHijoComponent } from './pages/list-hijo/list-hijo.component';

const routes: Routes =  [
  {
    path:'',
    children:[
      {path:'dashboard', component: CalificacionComponent},
      {path:'hijo', component: ListHijoComponent},
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
