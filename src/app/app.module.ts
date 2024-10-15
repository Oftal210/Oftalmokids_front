import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared.module';
import { AuthModule } from './auth/auth.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { UsuarioModule } from './usuario/usuario.module';

import { MenuComponent } from './menu/menu.component';
import { AuthInterceptor } from './interceptores/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    AuthModule,
    SuperadminModule,
    UsuarioModule
  ],
  providers: [
    provideClientHydration(),
    {provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
