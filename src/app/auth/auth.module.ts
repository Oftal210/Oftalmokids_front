import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule} from '@angular/forms';

import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VerificacionComponent } from './pages/verificacion/verificacion.component';
import { RecuperarContrasenaComponent } from './pages/recuperar-contrasena/recuperar-contrasena.component';




@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    VerificacionComponent,
    RecuperarContrasenaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
