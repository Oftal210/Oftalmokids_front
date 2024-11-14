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


  // METODOS PARA EL DASHBOARD ↓
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
  // METODOS PARA EL DASHBOARD ↑


  // METODO PARA EL FORO ↓ 
  // Metodo para traer todos los registros de foros en la tabla
  obtenerRegistrosForo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/foro`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para guardar o insertar registros de foro
  guardarRegistroForo(usuario: any, subtitulo: any, contenido: any, imagen: FormData) {
    return this.http.post<any>(this.apiUrl+'/foro', imagen, {params: {usuario: usuario, subtitulo: subtitulo, contenido: contenido}});
  }

  // Metodo para editar un registro de foro
  editarRegistroForo(id: any, subtitulo: any, contenido: any) {
    return this.http.put<any>(`${this.apiUrl}/foro/${id}`, {subtitulo: subtitulo, contenido: contenido});
  }
  // METODO PARA EL FORO ↑


  // METODO PARA PACIENTE ↓
  // Metodo para el listado de los hijos
  obtenerRegistroPaciente(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hijo`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar el paciente solicitado 
  buscarPaciente(hijo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hijo/${hijo}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar el padre del paciente solicitado 
  buscarPadre(padre: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${padre}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para guardar o insertar un hijo
  guardarRegistroHijo(documento: any, padre: any, nombre: any, apellido: any, tipodoc: any, nacimiento: any, edad: any, genero: any) {
    return this.http.post<any>(this.apiUrl+'/hijo', {documento: documento, padre: padre, nombre: nombre, apellido:apellido, tipodoc:tipodoc, nacimiento:nacimiento, foto:'ruta-foto', edad:edad, genero:genero});
  }
  // METODO PARA PACIENTE ↑


  // METODO PARA HISTORIA CLINICA ↓

  // Metodo para guardar un registros de historia clinica
  guardarRegistroHistoriaClinica(hijo: any,
    padre: any,
    edad_embarazo_madre: any,
    fue_alto_riesgo: any,
    especifique_riesgo: any,
    semanas_gestacion: any,
    tipo_parto: any,
    complicaciones_parto: any,
    especifique_complicaciones: any,
    uso_incubadora: any,
    tiempo_incubadora: any,
    puntaje_apgar: any,
    respiro_lloro_alnacer: any,
    emfermedad_en_embarazo: any,
    especifque_enfermedad_emb: any,
    medicamente_en_embarazo: any,
    especifique_medicamento: any,
    emfermedad_sistemica: any,
    especifique_enfer_sistemica: any,
    alergia: any,
    especifique_alergia: any,
    cirugia_general_ocular: any) {
      return this.http.post<any>(this.apiUrl+'/historiaclinica', {hijo: hijo,
        padre: padre,
        edad_embarazo_madre: edad_embarazo_madre,
        fue_alto_riesgo: fue_alto_riesgo,
        especifique_riesgo: especifique_riesgo,
        semanas_gestacion: semanas_gestacion,
        tipo_parto: tipo_parto,
        complicaciones_parto: complicaciones_parto,
        especifique_complicaciones: especifique_complicaciones,
        uso_incubadora: uso_incubadora,
        tiempo_incubadora: tiempo_incubadora,
        puntaje_apgar: puntaje_apgar,
        respiro_lloro_alnacer: respiro_lloro_alnacer,
        emfermedad_en_embarazo: emfermedad_en_embarazo,
        especifque_enfermedad_emb: especifque_enfermedad_emb,
        medicamente_en_embarazo: medicamente_en_embarazo,
        especifique_medicamento: especifique_medicamento,
        emfermedad_sistemica: emfermedad_sistemica,
        especifique_enfer_sistemica: especifique_enfer_sistemica,
        alergia: alergia,
        especifique_alergia: especifique_alergia,
        cirugia_general_ocular: cirugia_general_ocular});
    }

  // Metodo

  // METODO PARA HISTORIA CLINICA ↑


  // METODO PARA ADMINISTRADORES ↓
  // Metodo para el listado de los usuarios ADMINISTRADORES
  obtenerRegistroUsuario(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar el administrador solicitado 
  buscarAdministrador(admin: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarioadmin/${admin}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
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
  // METODO PARA ADMINISTRADORES ↑


  // METODO PARA SUPER ADMINISTRADOR ↓
  // Metodo para buscar el super administrador unicamente
  buscarSuperAdministrador(admin: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuariosuperadmin/${admin}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para modificar o actualizar datos del SUPER ADMINISTRADOR, solo el de id 1
  modficarSuperAdministrador(documento: any, nombre: any, apellido: any, email: any, telefono: any, password: any) {
    return this.http.put<any>(`${this.apiUrl}/superadmin/${documento}`, {nombre: nombre, apellido: apellido, email: email, telefono: telefono, password: password});
  }
  // METODO PARA SUPER ADMINISTRADOR ↑
  

  // METODO PARA PRECONSULTAS ↓
  // Metodo para buscar los registros de preconsultas de un hijo especifico
  buscarPreconsultasHijo(hijo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/preconsdelhijo/${hijo}`); // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar los registros de preconsultas de un hijo especifico
  buscarPromedioPreconsultasHijo(hijo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/promediomespreconsulta/${hijo}`); // colocamos la ruta como esta en nuestro archivo de rutas del API
  }
  // METODO PARA PRECONSULTAS ↑

  
  // METODO PARA PADRE ↓
  // Metodo para guardar o insertar un Padre
  guardarRegistroPadre(documento: any, id_rol: any, nombre: any, apellido: any, email: any, telefono: any, contrasena: any,) {
    return this.http.post<any>(this.apiUrl+'/usuario', {documento: documento, rol: id_rol, nombre: nombre, apellido:apellido, email:email, telefono:telefono, password:contrasena});
  }
  // METODO PARA PADRE ↑

  

  

  

  
  
}
