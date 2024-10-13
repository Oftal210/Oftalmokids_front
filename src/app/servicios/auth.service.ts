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

}
