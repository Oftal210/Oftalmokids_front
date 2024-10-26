import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}
