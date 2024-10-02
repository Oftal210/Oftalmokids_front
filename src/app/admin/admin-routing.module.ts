import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddPacienteComponent } from './pages/add-paciente/add-paciente.component';

const routes: Routes =  [
  {
    path:'',
    children:[
      {path:'add-paciente', component: AddPacienteComponent},
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AdminRoutingModule { 
  static getRoutes(): Routes{
    return routes;
  }
}
