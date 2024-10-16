import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VerificacionComponent } from './pages/verificacion/verificacion.component';
import { RecuperarContrasenaComponent } from './pages/recuperar-contrasena/recuperar-contrasena.component';

const routes: Routes =  [
  {
    path:'',
    children:[
      {path:'login', component: LoginComponent},
      {path:'registro', component: RegistroComponent},
      {path: 'verificacion', component: VerificacionComponent},
      {path: 'recuperar-contrasena', component: RecuperarContrasenaComponent},

    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AuthRoutingModule { 
  static getRoutes(): Routes{
    return routes;
  }
}
