import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionService } from '../servicios/notificacion.service';

// Servicio para comunicarse con el API
import { SuperadminService } from '../servicios/superadmin.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showDropdown = false;
  dropDownCampa = false;

  constructor(
    private router: Router,
    private superadminservice: SuperadminService,
    private notificacionservice: NotificacionService
  ) {}
  
  // Permite abrir el menú del perfil y cerrar sesión
  toggleDropdown() {
    if(this.dropDownCampa){
      this.dropDownCampa = false
    }
    this.showDropdown = !this.showDropdown;
  }

  // Permite abrir el menú del perfil y cerrar sesión
  toggleDropdownCampanita() {
    if(this.showDropdown){
      this.showDropdown = false
    }
    this.dropDownCampa = !this.dropDownCampa;
  }

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // Ruta para redirigir a la persona
  rutaPerfil: string = '';
  nombreperfil: string = '';


  // Funcion para redirigir a la persona
  ngOnInit(){
    // verificamos el rol para sacarlo al login
    if (this.documentoAdministrador) {
      var docAdministrador = JSON.parse(this.documentoAdministrador);
      if(docAdministrador.id_rol == 1){
        this.rutaPerfil = '/perfil';
        this.nombreperfil = 'Administrador';
      } else {
        this.rutaPerfil = '/perfil-padre';
        this.nombreperfil = 'Padre';
      }
    }

    this.notificacionservice.listenForNotifications(docAdministrador.documento);
  }

  // Funcion para cerrar la sesion actual
  cerrarSesion() {
    this.superadminservice.cerrarSesion().subscribe( response => { 
      // Maneja la respuesta de cierre de sesión exitoso 
      console.log('Sesión cerrada exitosamente', response); 
      // Aquí puedes redirigir al usuario a la página de inicio de sesión o realizar otras acciones necesarias 
      }, error => { 
        // Maneja el error que pueda ocurrir 
        console.error('Error al cerrar la sesión', error); 
      } 
    );
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
