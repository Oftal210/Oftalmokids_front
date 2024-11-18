import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PadreService {

  // ruta del api
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Metodo para registrar la preconsulta
  enviarPreconsulta(hijo: any, uso_gafas: any, uso_medic: any, limite_panta: any, activ_libre: any, buen_alimen: any, solict_contr: any, punt_precon: any, motivo_gafas: any, motivo_medic: any, motivo_panta: any, motivo_activ: any, motivo_buen: any, motivo_contr: any,) {
    return this.http.post<any>(this.apiUrl+'/preconsulta', {hijo: hijo, uso_gafas: uso_gafas, uso_medic: uso_medic, limite_panta: limite_panta, activ_libre: activ_libre, buen_alimen: buen_alimen, solict_contr: solict_contr, punt_precon: punt_precon, motivo_gafas: motivo_gafas, motivo_medic: motivo_medic, motivo_panta:motivo_panta, motivo_activ: motivo_activ, motivo_buen: motivo_buen, motivo_contr: motivo_contr});
  }

  // Metodo para buscar el padre solicitado 
  buscarPadre(padre: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${padre}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para modificar o actualizar datos de un padre
  modficarPadre(documento: any, nombre: any, apellido: any, email: any, telefono: any, password: any) {
    return this.http.put<any>(`${this.apiUrl}/usuariopadre/${documento}`, {nombre: nombre, apellido: apellido, email: email, telefono: telefono, password: password});
  }

  // Metodo para el listado de los hijos del padre
  obtenerHijosPadre(padre: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hijosdepadre/${padre}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar el paciente solicitado 
  buscarPaciente(hijo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hijo/${hijo}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para guardar o insertar un hijo
  guardarRegistroHijo(documento: any, padre: any, nombre: any, apellido: any, tipodoc: any, nacimiento: any, edad: any, genero: any, direccion: any, foto: FormData) {
    return this.http.post<any>(this.apiUrl+'/hijo', foto, {params: { documento: documento, padre: padre, nombre: nombre, apellido:apellido, tipodoc:tipodoc, nacimiento:nacimiento, edad:edad, genero:genero, direccion: direccion}});
  }
  
  // Metodo para guardar o insertar un hijo
  modificarRegistroHijo(hijo: any, dato: any) {
    return this.http.put<any>(`${this.apiUrl}/hijo/${hijo}`, dato, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
