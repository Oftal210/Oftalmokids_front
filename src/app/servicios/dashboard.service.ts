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

  enviarPreconsulta(hijo: any, uso_gafas: any, uso_medic: any, limite_panta: any, activ_libre: any, buen_alimen: any, solict_contr: any, punt_precon: any, motivo_gafas: any, motivo_medic: any, motivo_panta: any, motivo_activ: any, motivo_buen: any, motivo_contr: any,) {
    return this.http.post<any>(this.apiUrl+'/preconsulta', {hijo: hijo, uso_gafas: uso_gafas, uso_medic: uso_medic, limite_panta: limite_panta, activ_libre: activ_libre, buen_alimen: buen_alimen, solict_contr: solict_contr, punt_precon: punt_precon, motivo_gafas: motivo_gafas, motivo_medic: motivo_medic, motivo_panta:motivo_panta, motivo_activ: motivo_activ, motivo_buen: motivo_buen, motivo_contr: motivo_contr});
  }

  // enviarPreconsulta(parametros: any) {
  //   return this.http.post<any>(this.apiUrl+'/preconsulta', {parametros});
  // }
}
