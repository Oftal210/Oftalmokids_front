import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // ruta del api
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Método para el listado de los hijos
  obtenerPacientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cantidadhijo`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }
  
  // Metodo para traer el numero de padres registrados
  obtenerPadres(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuariospadre`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para traer el numero de consultas registradas por cada 2 meses
  obtenerConsultasxMeses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/diagnosticosxmeses`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }
}
