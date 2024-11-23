import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  // ruta del api
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Metodo para traer las notificaciones del foro
  obtenerNotificaciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/notificaciones`);  // colocamos la ruta como esta en nuestro archivo de rutas del API
  }

  // Metodo para cerrar la sesión
  cerrarSesion(){
    return this.http.post<any>(`${this.apiUrl}/logout`, null);
  }
  
}
