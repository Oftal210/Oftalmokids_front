import { Injectable } from '@angular/core';
import { environment } from '../../environment/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../Modelos/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.apiUrl + 'auth/';

  constructor(private http: HttpClient) { }

  registro(user: User ):Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(this.url + "registrarse", user,{ headers })
  }

  verificarEmail(email: string, cod_ver: string): Observable<any>{
    const body = {email, cod_ver}
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}validate_email`, body, { headers })
  }

  recuperarContrasena(email: string){
    return this.http.post(this.url+ "recuperar_contrasena", {email: email});
  }

  login(documento: any, contrasena: any) {
    return this.http.post(this.url + "login", { documento: documento, contrasena: contrasena });
  }

  

}
