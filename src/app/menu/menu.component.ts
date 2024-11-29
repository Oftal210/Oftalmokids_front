import { Component } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

import { User } from '../Modelos/user.model';
import { AuthService } from '../servicios/auth.service';
import { MenuService } from '../servicios/menu.service';
import { decode } from 'punycode';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  token: string | null = null;
  user: User | null = null;
  currentRolName: string | null = "";
  currentRolId: string | null = "";
  role: string | null = null;
  rolUser: string | null = null;
  menuItems: any[] = [];
  isAuthenticated: boolean = true;
  logueado = false;
  private intervaloToken: any;

  // variable para tomar el token de usuario
  tokenAdministrador = sessionStorage.getItem('token'); 

  constructor(
    private authservices: AuthService,
    private menuService: MenuService,
    private router: Router
  ) {}

  /* Inicializa el componente y valida el token de usuario */
  ngOnInit() {
    this.validateToken();
    this.isAuthenticated = this.authservices.isAuthenticated();
    this.logueado = this.token !== null;
    this.getRolUser();

    if (this.logueado && this.user) {
      this.currentRolId = this.user.id_rol?.toString();

    } else {
      //console.log("No está logueado o no se pudo cargar el usuario.");
    }
    if (this.currentRolName) {
      this.menuItems = this.menuService.getRoutesByRole(this.currentRolName);
    } else {
      //console.warn('currentRolName es null o vacío.');
      this.menuItems = []; // Manejar el caso
    }

    // funcion para validar cada 60 segundos 
    this.checkTokenExpiration(); 
    this.intervaloToken = setInterval(() => { 
      this.checkTokenExpiration();
    }, 60000); // tiempo en milisegunos 1000 ml = 1 s
  }

  ngOnDestroy() {
    // Detener el intervalo al destruir el componente
    if (this.intervaloToken) {
      clearInterval(this.intervaloToken);
    }
  }

  /* Determina el rol del usuario basado en su id_rol */
  getRolUser(): void {
    if (this.token && this.user) { // Verificar que user no es null
      if (this.user.id_rol === 1) {
        this.rolUser = 'Super Admin';
      } else if (this.user.id_rol === 2) {
        this.rolUser = 'Padre';
      }
    }
  }

  /* Valida el token del usuario almacenado en localStorage */
  validateToken(): void {
    this.token = sessionStorage.getItem("token");

    if (this.token) {
      const identityJSON = sessionStorage.getItem('identity');
      if (identityJSON) {
        this.user = JSON.parse(identityJSON);
        this.currentRolName = sessionStorage.getItem('currentRolName');
        //console.log(this.currentRolName);
        this.currentRolId = this.user?.id_rol?.toString() || '';
      }
    } else {
      this.router.navigate(['/login']);
      sessionStorage.removeItem('token'); 
    }
  }

  checkTokenExpiration() { 
    if (this.tokenAdministrador && this.isTokenExpired(this.tokenAdministrador)) { 
      //console.log('El token ha expirado');
      sessionStorage.removeItem('token');
      clearInterval(this.intervaloToken);
      this.router.navigate(['home']); // Redirige al login
      alert('Su Sesión ha expirado, inicie nuevamente');
    }
  } 
   
  isTokenExpired(token: string): boolean {
    const decoded = jwtDecode<any>(token);
    //console.log(decoded)
    const currentTime = Date.now() / 1000;  // tiempo en segundos 
    return decoded.exp < currentTime;       // exp es el tiempo de expiración del token
  }
}
