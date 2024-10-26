import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {

  // ruta del api
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Método para el listado de los hijos
  obtenerNumeroPacientes(): Observable<any> {
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

  // Metodo para traer todos los registros de foros en la tabla
  obtenerRegistrosForo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/foro`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para guardar registros de foro
  guardarRegistroForo(usuario: any, subtitulo: any, contenido: any) {
    return this.http.post<any>(this.apiUrl+'/foro', {usuario: usuario, subtitulo: subtitulo, contenido: contenido});
  }

  // Metodo para editar un registro de foro
  editarRegistroForo(id: any, subtitulo: any, contenido: any) {
    return this.http.put<any>(`${this.apiUrl}/foro/${id}`, {subtitulo: subtitulo, contenido: contenido});
  }

  // Método para el listado de los hijos
  obtenerRegistroPaciente(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hijo`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

}
