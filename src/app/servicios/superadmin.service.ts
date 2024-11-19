import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { ReceiptRussianRubleIcon } from 'lucide-angular';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

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
  editarRegistroForo(id: any, subtitulo: any, contenido: any, imagen: FormData) {
    return this.http.post<any>(`${this.apiUrl}/foro/${id}`, imagen, {params: {subtitulo: subtitulo, contenido: contenido}});
  }

  // Metodo para editar un registro de foro
  eliminiarRegistroForo(id: any) {
    return this.http.delete<any>(`${this.apiUrl}/foro/${id}`);
  }

  // Metodo para calificar dando like a un registro de foro
  guardarLikeForo(foro: any, usuario: any) {
    return this.http.post<any>(this.apiUrl+'/forolike', {foro: foro, usuario: usuario});
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


  // Metodo para buscar el pacientes segun documento parecido
  buscarPacienteParecido(hijo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pacientescoincidan/${hijo}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar el padre del paciente solicitado 
  buscarPadre(padre: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${padre}`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para guardar o insertar un hijo
  guardarRegistroHijo(documento: any, padre: any, nombre: any, apellido: any, tipodoc: any, nacimiento: any, edad: any, genero: any) {
    return this.http.post<any>(this.apiUrl+'/hijo', {documento: documento, padre: padre, nombre: nombre, apellido:apellido, tipodoc:tipodoc, nacimiento:nacimiento, edad:edad, genero:genero});
  }
  // METODO PARA PACIENTE ↑


  // METODO PARA HISTORIA CLINICA ↓

  // Metodo para traer los registros de los diagnosticos
  obtenerRegustroDiagnostico(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/diagnostico`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

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
    alergia: boolean,
    especifique_alergia: any,
    cirugia_general_ocular: any,
    fecha: any,
    hora: any,
    direccion: any) {
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
      cirugia_general_ocular: cirugia_general_ocular,
      fecha: fecha,
      hora: hora,
      direccion: direccion
    });
  }

  // Metodo para guardar un registro de antecedente visual
  guardarRegistroAntecedenteVisual (
    historia_clinica: any,
    correcion_optica: any,
    edad_lente_primera_vez: any,
    cuantos_cambio_rx: any,
    motivo_cambio_rx: any,
    material_tratamiento_optico: any,
    indicaciones_uso: any,
    fecha_ultimo_examen: any
  ) {
    return this.http.post<any>(this.apiUrl+'/antecedetevisual', {
      historia_clinica: historia_clinica,
      correcion_optica: correcion_optica,
      edad_lente_primera_vez: edad_lente_primera_vez,
      cuantos_cambio_rx: cuantos_cambio_rx,
      motivo_cambio_rx: motivo_cambio_rx,
      material_tratamiento_optico: material_tratamiento_optico,
      indicaciones_uso: indicaciones_uso,
      fecha_ultimo_examen: fecha_ultimo_examen
    });
  }

  // Metodo para guardar un registro de agudeza visual
  guardarRegistroAgudezaVisual (
    historia_clinica: any,
    test: any,
    distancia: any,
    od_sc_vl: any,
    od_vp: any,
    od_ph: any,
    os_sc_vl: any,
    os_vp: any,
    os_ph: any,
    lensome_od: any,
    lensome_os: any,
    od_cc_vl: any,
    od_vp_lenso: any,
    os_cc_vl: any,
    os_vp_lenso: any,
    queratome_od: any,
    queratome_os: any
  ) {
    const token = sessionStorage.getItem('token'); // Obtén el token desde el local storage 
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<any>(this.apiUrl+'/agudezavisual', {
      historia_clinica: historia_clinica,
      test: test,
      distancia: distancia,
      od_sc_vl: od_sc_vl,
      od_vp: od_vp,
      od_ph: od_ph,
      os_sc_vl: os_sc_vl,
      os_vp: os_vp,
      os_ph: os_ph,
      lensome_od: lensome_od,
      lensome_os: lensome_os,
      od_cc_vl: od_cc_vl,
      od_vp_lenso: od_vp_lenso,
      os_cc_vl: os_cc_vl,
      os_vp_lenso: os_vp_lenso,
      queratome_od: queratome_od,
      queratome_os: queratome_os
    });
  }

  // Metodo para guardar un registro de retinoscopia
  guardarRegistroRetinoscopia (
    historia_clinica: any,
    retino_tecnica: any,
    retino_ciclople: any,
    retino_refrac_od: any,
    retino_subjet_od: any,
    retino_final_od: any,
    retino_refrac_os: any,
    retino_subjet_os: any,
    retino_final_os: any,
  ) {
    return this.http.post<any>(this.apiUrl+'/retinoscopia', {
      historia_clinica: historia_clinica,
      retino_tecnica: retino_tecnica,
      retino_ciclople: retino_ciclople,
      retino_refrac_od: retino_refrac_od,
      retino_subjet_od: retino_subjet_od,
      retino_final_od: retino_final_od,
      retino_refrac_os: retino_refrac_os,
      retino_subjet_os: retino_subjet_os,
      retino_final_os: retino_final_os
    });
  }

  // Metodo para guardar un registro de alineamiento motor
  guardarRegistroAlineamientoMotor (
    historia_clinica: any,
    hirschberg: any,
    bruckner: any,
    covet_test_vl: any,
    covet_test_vp: any,
    esta_acomo_flex: any,
    esta_acomo_aa: any,
  ) {
    return this.http.post<any>(this.apiUrl+'/alineamientomotor', {
      historia_clinica: historia_clinica,
      hirschberg: hirschberg,
      bruckner: bruckner,
      covet_test_vl: covet_test_vl,
      covet_test_vp: covet_test_vp,
      esta_acomo_flex: esta_acomo_flex,
      esta_acomo_aa: esta_acomo_aa
    });
  }

  // Metodo para guardar un registro de versiones
  guardarRegistroVersiones (
    historia_clinica: any,
    observacion_versiones: any
  ) {
    return this.http.post<any>(this.apiUrl+'/version', {
      historia_clinica: historia_clinica,
      observacion_versiones: observacion_versiones
    });
  }

  // Metodo para guardar un registro de ducciones
  guardarRegistroDucciones ( 
    historia_clinica: any,
    ducc_normal_od: any,
    ducc_parecia_od: any,
    ducc_paralisis_od: any,
    ducc_normal_os: any,
    ducc_parecia_os: any,
    ducc_paralisis_os: any
  ) {
    return this.http.post<any>(this.apiUrl+'/duccion', {
      historia_clinica: historia_clinica,
      ducc_normal_od: ducc_normal_od,
      ducc_parecia_od: ducc_parecia_od,
      ducc_paralisis_od: ducc_paralisis_od,
      ducc_normal_os: ducc_normal_os,
      ducc_parecia_os: ducc_parecia_os,
      ducc_paralisis_os: ducc_paralisis_os
    });
  }

  // Metodo para guardar un registro de motalidad ocular
  guardarRegistroMotalidadOcular (
    historia_clinica: any,
    mo_seguimiento_od: any,
    mo_sacadicos_od: any,
    mo_seguimiento_os: any,
    mo_sacadicos_os: any,
    mo_seguimiento_ao: any,
    mo_sacadicos_ao: any,
  ) {
    return this.http.post<any>(this.apiUrl+'/motalidad', {
      historia_clinica: historia_clinica,
      mo_seguimiento_od: mo_seguimiento_od,
      mo_sacadicos_od: mo_sacadicos_od,
      mo_seguimiento_os: mo_seguimiento_os,
      mo_sacadicos_os: mo_sacadicos_os,
      mo_seguimiento_ao: mo_seguimiento_ao,
      mo_sacadicos_ao: mo_sacadicos_ao
    });
  }

  // Metodo para guardar un registro de exploracion de externos
  guardarRegistroExploracionExternos (
    historia_clinica: any,
    explo_exter_od: any,
    explo_exter_os: any
  ) {
    return this.http.post<any>(this.apiUrl+'/exploracion', {
      historia_clinica: historia_clinica,
      explo_exter_od: explo_exter_od,
      explo_exter_os: explo_exter_os
    });
  }

  // Metodo para guardar un registro de oftalmoscopia
  guardarRegistroOftalmoscopia (
    historia_clinica: any,
    medi_refrin_od: any,
    refle_fovea_od: any,
    papila_od: any,
    excav_fisio_od: any,
    profundidad_od: any,
    vasos_od: any,
    rela_arte_od: any,
    macula_od: any,
    reti_perif_od: any,
    medi_refrin_os: any,
    refle_fovea_os: any,
    papila_os: any,
    excav_fisio_os: any,
    profundidad_os: any,
    vasos_os: any,
    rela_arte_os: any,
    macula_os: any,
    reti_perif_os: any,
  ) {
    return this.http.post<any>(this.apiUrl+'/oftalmoscopia', {
      historia_clinica: historia_clinica,
      medi_refrin_od: medi_refrin_od,
      refle_fovea_od: refle_fovea_od,
      papila_od: papila_od,
      excav_fisio_od: excav_fisio_od,
      profundidad_od: profundidad_od,
      vasos_od: vasos_od,
      rela_arte_od: rela_arte_od,
      macula_od: macula_od,
      reti_perif_od: reti_perif_od,
      medi_refrin_os: medi_refrin_os,
      refle_fovea_os: refle_fovea_os,
      papila_os: papila_os,
      excav_fisio_os: excav_fisio_os,
      profundidad_os: profundidad_os,
      vasos_os: vasos_os,
      rela_arte_os: rela_arte_os,
      macula_os: macula_os,
      reti_perif_os: reti_perif_os
    });
  }

  // Metodo para guardar un registro de diagnostico x historia clinica
  guardarRegistroDiagxHistoriaClinica (
    historia_clinica: any,
    diagnostico: any,
    motivo_consulta: any,
    tratamiento_diagnostico: any,
    pronostico_diagnostico: any,
    control_diagnostico: any) {
    return this.http.post<any>(this.apiUrl+'/diagnosticoxhistoria', {
      historia_clinica: historia_clinica,
      diagnostico: diagnostico,
      motivo_consulta: motivo_consulta,
      tratamiento_diagnostico: tratamiento_diagnostico,
      pronostico_diagnostico: pronostico_diagnostico,
      control_diagnostico: control_diagnostico
    });
  }

  // Metodo para traer datos de la historia clinica del hijo
  obtenerRegistroHistoria(hijo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/historiasdelhijo/${hijo}`);
  }

  // Metodo para traer datos del antecedente visual del hijo
  obtenerRegistroAnteVisual(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/antevisureciente/${historia}`);
  }

  // Metodo para traer datos de la agudeza visual del hijo
  obtenerRegistroAgudeza(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/agudezavisualreciente/${historia}`);
  }

  // Metodo para traer datos de la retinoscopia del hijo
  obtenerRegistroRetinoscopia(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/retinoscopiareciente/${historia}`);
  }

  // Metodo para traer datos del alineamiento motor del hijo
  obtenerRegistroAlineamiento(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/alineamientoreciente/${historia}`);
  }

  // Metodo para traer datos de las versiones del hijo
  obtenerRegistroVersiones(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/versionreciente/${historia}`);
  }

  // Metodo para traer datos de las ducciones del hijo
  obtenerRegistroDucciones(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/duccionreciente/${historia}`);
  }

  // Metodo para traer datos de la motalidad ocular del hijo
  obtenerRegistroMotalidad(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/motalidadxreciente/${historia}`);
  }

  // Metodo para traer datos de la exploracion de externos del hijo
  obtenerRegistroExploracion(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/exploracionreciente/${historia}`);
  }

  // Metodo para traer datos de la oftalmoscopia del hijo
  obtenerRegistroOftalmoscopia(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/oftalmoscopiaxreciente/${historia}`);
  }

  // Metodo para traer datos del diagnostico x historia clinica del hijo
  obtenerRegistrosDiagnosticos(historia: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/diagnosticoxhistoriaxhistcli/${historia}`);
  }
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

  // Metodo para cerrar la sesión
  cerrarSesion(){
    return this.http.post<any>(`${this.apiUrl}/logout`, null);
  }

  // METODO PARA ADMINISTRADORES ↑


  // METODO PARA SUPER ADMINISTRADOR ↓
  // Metodo para buscar el super administrador unicamente
  buscarSuperAdministrador(admin: any): Observable<any> { 
    const token = sessionStorage.getItem('token'); // Obtén el token desde el local storage 
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` }); 
    return this.http.get<any>(`${this.apiUrl}/usuariosuperadmin/${admin}`); // Agrega los encabezados a la solicitud 
  }

  // Metodo para modificar o actualizar datos del SUPER ADMINISTRADOR, solo el de id 1
  modficarSuperAdministrador(documento: any, nombre: any, apellido: any, email: any, telefono: any, password: any) {
    return this.http.put<any>(`${this.apiUrl}/superadmin/${documento}`, {nombre: nombre, apellido: apellido, email: email, telefono: telefono, password: password});
  }
  // METODO PARA SUPER ADMINISTRADOR ↑
  

  // METODO PARA PRECONSULTAS ↓
  // Metodo para buscar los registros de preconsultas de un hijo especifico
  buscarPreconsultasHijoFechas(hijo: any, fechaInicio: any, fechaFin: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/preconsultafechas/${hijo}`, {fechaInicio: fechaInicio, fechaFin: fechaFin}); // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar los registros de preconsultas de un hijo especifico
  buscarPromedioPreconsultasHijo(hijo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/promediomespreconsulta/${hijo}`); // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para buscar los registros de preconsultas mas reciente del paciente
  buscarPreconsultaReciente(hijo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/preconsultareciente/${hijo}`); // colocamos la ruta como esta en nuestro archivo de rutas del API
  }  
  // METODO PARA PRECONSULTAS ↑

  
  // METODO PARA PADRE ↓
  // Metodo para guardar o insertar un Padre
  guardarRegistroPadre(documento: any, id_rol: any, nombre: any, apellido: any, email: any, telefono: any, contrasena: any,) {
    return this.http.post<any>(this.apiUrl+'/usuariopadre', {documento: documento, rol: id_rol, nombre: nombre, apellido:apellido, email:email, telefono:telefono, password:contrasena});
  }
  // METODO PARA PADRE ↑

  
}
