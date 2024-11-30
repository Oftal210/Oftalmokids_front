import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './servicios/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Oftalmokids_front';
  mostrarMenu: boolean = true;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    // Escuchar eventos de navegación para actualizar el estado del menú
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Verificar si estamos en una de las rutas de login o registro
        const currentRoute = event.urlAfterRedirects;
        this.mostrarMenu = !currentRoute.includes('/login') 
                        && !currentRoute.includes('/registro') 
                        && !currentRoute.includes('/recuperar-contrasena') 
                        && !currentRoute.includes('/verificacion');
      }
    });
  }
}
