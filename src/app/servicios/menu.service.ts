import { Injectable } from '@angular/core';
import { Route, Routes } from '@angular/router';

import { SuperadminRoutingModule } from '../superadmin/superadmin-routing.module';
import { UsuarioRoutingModule } from '../usuario/usuario-routing.module';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  /* Mapeo de roles a sus respectivas rutas */
  private roleRoutes: { [key: string]: Routes } = {
    SuperAdministrador: SuperadminRoutingModule.getRoutes(),
    UsuarioRoutingModule: UsuarioRoutingModule.getRoutes(),
  };

  constructor() { }

  /* Obtiene las rutas del menú para un rol específico */
  getRoutesByRole(role: string): any[] {
    const routes = this.roleRoutes[role] || [];
    return this.flattenRoutes(routes).filter(route => route.data?.['showInMenu']).map(route => ({
      name: route.data?.['title'],
      route: `/${route.path}`,
      icon: route.data?.['icon'],
    }));
  }

  /* Aplana la estructura de rutas anidadas */
  private flattenRoutes(routes: Routes): Route[] {
    const flatRoutes: Route[] = [];
    routes.forEach(route => {
      if (route.children) {
        flatRoutes.push(...this.flattenRoutes(route.children));
      } else {
        flatRoutes.push(route);
      }
    });
    return flatRoutes;
  }
}
