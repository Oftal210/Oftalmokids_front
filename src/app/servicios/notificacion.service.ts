import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private echo: Echo<any>;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'pusher', 
      key: '602a56e3e8234c983ae5', 
      cluster: 'us2', 
      encrypted: true, 
      forceTLS: true,
      authEndpoint: 'http://localhost:8000/broadcasting/auth',
      auth: {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        }
      }
    });
  }

  listenForNotifications(userDocumento: any) {
    console.log('entro');
    this.echo.private(`App.Models.User.${userDocumento}`)
    .notification((notification: any) => {
      console.log('Nueva notificación:', notification);
      // Manejar la notificación en tu aplicación
      })
    .error((error: any) => {
      console.error('Error en el canal:', error);
    });
  }
}
