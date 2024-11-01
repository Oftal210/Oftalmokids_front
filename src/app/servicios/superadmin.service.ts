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

  // Metodo para guardar o insertar registros de foro
  guardarRegistroForo(usuario: any, subtitulo: any, contenido: any) {
    return this.http.post<any>(this.apiUrl+'/foro', {usuario: usuario, subtitulo: subtitulo, contenido: contenido});
  }

  // Metodo para editar un registro de foro
  editarRegistroForo(id: any, subtitulo: any, contenido: any) {
    return this.http.put<any>(`${this.apiUrl}/foro/${id}`, {subtitulo: subtitulo, contenido: contenido});
  }

  // Metodo para el listado de los hijos
  obtenerRegistroPaciente(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hijo`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para el listado de los usuarios ADMINISTRADORES
  obtenerRegistroUsuario(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar el paciente solicitado 
  buscarPaciente(hijo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hijo/${hijo}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar el padre del paciente solicitado 
  buscarPadre(padre: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${padre}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar el administrador solicitado 
  buscarAdministrador(admin: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarioadmin/${admin}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar el super administrador unicamente
  buscarSuperAdministrador(admin: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuariosuperadmin/${admin}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }  
  
  // Metodo para guardar o insertar un hijo
  guardarRegistroHijo(documento: any, padre: any, nombre: any, apellido: any, tipodoc: any, nacimiento: any) {
    return this.http.post<any>(this.apiUrl+'/hijo', {documento: documento, padre: padre, nombre: nombre, apellido:apellido, tipodoc:tipodoc, nacimiento:nacimiento, foto:'ruta-foto'});
  }

  // Metodo para guardar o insertar un Padre
  guardarRegistroPadre(documento: any, id_rol: any, nombre: any, apellido: any, email: any, telefono: any, contrasena: any,) {
    return this.http.post<any>(this.apiUrl+'/usuario', {documento: documento, rol: id_rol, nombre: nombre, apellido:apellido, email:email, telefono:telefono, password:contrasena});
  }

  // Metodo para guardar o insertar un ADMINISTRADOR
  guardarRegistroAdministrador(documento: any, id_rol: any, nombre: any, apellido: any, email: any, telefono: any, contrasena: any,) {
    return this.http.post<any>(this.apiUrl+'/usuario', {documento: documento, rol: id_rol, nombre: nombre, apellido:apellido, email:email, telefono:telefono, password:contrasena});
  }

  // Metodo para activar o desactivar un ADMINISTRADOR
  desactivarAdministrador(admin: any) {
    return this.http.put<any>(`${this.apiUrl}/usuariodesactiar/${admin}`, admin);
  }

  // Metodo para modificar o actualizar datos de un ADMINISTRADOR
  modficarAdministrador(documento: any, nombre: any, apellido: any, email: any, telefono: any, password: any) {
    return this.http.put<any>(`${this.apiUrl}/usuario/${documento}`, {nombre: nombre, apellido: apellido, email: email, telefono: telefono, password: password});
  }

  // Metodo para modificar o actualizar datos del SUPER ADMINISTRADOR, solo el de id 1
  modficarSuperAdministrador(documento: any, nombre: any, apellido: any, email: any, telefono: any, password: any) {
    return this.http.put<any>(`${this.apiUrl}/superadmin/${documento}`, {nombre: nombre, apellido: apellido, email: email, telefono: telefono, password: password});
  }
  
}
