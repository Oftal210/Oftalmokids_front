import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../Modelos/user.model';
import { AuthService } from '../../../servicios/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../../Modelos/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    hide = true;
    reply: Login | null = null;
    token: string | null = null;
    user: User | any;
    currentRolId: string | null = null;
    isSubmitting = false;
    isLoaded = false;

    loginForm = this.fb.group({
        documento: ['', Validators.required],
        contrasena: ['', Validators.required],
    });

constructor( 
  private fb: FormBuilder,
  private loginService: AuthService,
  private router: Router,
){}

validateToken(): void {
  if (!this.token) {
      this.token = sessionStorage.getItem("token");
      let identityJSON = sessionStorage.getItem('identity');

      if (identityJSON) {
          let identity = JSON.parse(identityJSON);
          this.user = identity;
          this.currentRolId = this.user.id_rol?.toString();
      }
  }
  if (!this.token) {
      this.router.navigate(['/login']);
  } else {
      if (this.currentRolId) {
          switch (this.currentRolId) {
              case '1':
                  this.router.navigate(['dashboard']);
                  break;
              case '2':
                  this.router.navigate(['hijo']);
                  break;
              default:
                  this.router.navigate(['login']);
                  break;
          }
      } else {
          console.error('Id de rol no está definido.');
          this.router.navigate(['login']);
      }
  }
}

login(): void {
    if (this.isSubmitting) {
        return;
    }
    this.isSubmitting = true;

    const documento = this.loginForm.get('documento')?.value;
    const contrasena = this.loginForm.get('contrasena')?.value;

    if (!documento) {
        // this.alertService.errorAlert('Error', "El campo de Correo es requerido");
        this.isSubmitting = false;
        return;
    }
    if (!contrasena) {
        // this.alertService.errorAlert('Error', "el campo de contraseña es requerido");
        this.isSubmitting = false;
        return;
    }
    this.loginService.login(documento, contrasena).subscribe(
        (rs: any) => {
            this.reply = rs;
            console.log('API response:', rs);
            if (this.reply) {
                // this.reply.user.id_rol = Number(this.reply.user.id_rol);
                console.log('id_rol login',this.reply.user.id_rol);
                sessionStorage.setItem('token', this.reply.access_token);
                sessionStorage.setItem('identity', JSON.stringify(this.reply.user));
                sessionStorage.setItem('currentRolName', this.getRoleName(Number(this.reply.user.id_rol)));
                this.token = this.reply.access_token;
                if (this.reply.user) {
                    sessionStorage.setItem('documento', this.reply.user.documento);
                }
                //alert('Inicio de sesión exitoso');
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 2000);
            }
            this.isSubmitting = false;
        },
        err => {
            console.error(err);
            if (err.status === 401) {
                // this.alertService.errorAlert('Error', err.error.message);
            } else if (err.status === 404) {
                // this.alertService.errorAlert('Error', err.error.message);
            } else if (err.status === 403) {
                // this.alertService.errorAlert('Error', err.error.message);
            } else if (err.status === 410) {
                // this.alertService.errorAlert('Error', err.error.message);
            }
            if (err.status === 409) {
                // this.router.navigate(['/verification'], { queryParams: { email: email } });
            }
            setTimeout(() => {
                this.isSubmitting = false;
            }, 2000);
        }
    );
}

getRoleName(rolId: number | undefined | null): string {
    switch (rolId) {
        case 1:
            return 'SuperAdministrador';
        default:
            return 'Padre';
    }
}

}
