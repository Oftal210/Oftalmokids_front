import { Component } from '@angular/core';

import { User } from '../Modelos/user.model';
import { AuthService } from '../servicios/auth.service';
import { MenuService } from '../servicios/menu.service';

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

  constructor(
    private authservices: AuthService,
    private menuService: MenuService) { }

  /* Inicializa el componente y valida el token de usuario */
  ngOnInit() {
    this.validateToken();
    this.isAuthenticated = this.authservices.isAuthenticated();
    this.logueado = this.token !== null;
    this.getRolUser();

    if (this.logueado && this.user) {
      this.currentRolId = this.user.id_rol?.toString();

    } else {
      console.log("No está logueado o no se pudo cargar el usuario.");
    }
    if (this.currentRolName) {
      this.menuItems = this.menuService.getRoutesByRole(this.currentRolName);
    } else {
      console.warn('currentRolName es null o vacío.');
      this.menuItems = []; // Manejar el caso
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
        console.log(this.currentRolName);
        this.currentRolId = this.user?.id_rol?.toString() || '';
      }
    }
  }


}
