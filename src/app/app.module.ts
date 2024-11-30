import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared.module';
import { AuthModule } from './auth/auth.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { UsuarioModule } from './usuario/usuario.module';

import { MenuComponent } from './menu/menu.component';
import { AuthInterceptor } from './interceptores/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LucideAngularModule, LayoutDashboard, Users, UserRound, MessageCircle, ContactRound, MessageSquareText,  } from 'lucide-angular';
import Swal from 'sweetalert2';
 

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    SuperadminModule,
    UsuarioModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ LayoutDashboard,Users, UserRound, MessageCircle, ContactRound, MessageSquareText })
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,},
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
