import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Servicio para comunicarse con el API
import { SuperadminService } from '../servicios/superadmin.service';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showDropdown = false;
  user:any

  constructor(
    private router: Router,
    private superadminservice: SuperadminService,
    private authService:AuthService
  ) {}

  ngOnInit(){
    this.user = this.authService.getUser();
  }
  
  // Permite abrir el menú del perfil y cerrar sesión
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

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
