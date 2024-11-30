import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../Modelos/user.model';
import { AuthService } from '../../../servicios/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../../Modelos/login';
import Swal from 'sweetalert2';

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
                //console.error('Id de rol no está definido.');
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
            this.mostrarAlerta('', 'No Ingreso el Documento', 'error');
            this.isSubmitting = false;
            return;
        }
        if (!contrasena) {
            this.mostrarAlerta('', 'No Ingreso la Contraseña', 'error');
            this.isSubmitting = false;
            return;
        }
        this.loginService.login(documento, contrasena).subscribe(
            (rs: any) => {
                this.mostrarAlerta('Espere un Momento', 'Estamos validando sus Datos', 'info');
                //console.log(rs);
                if (rs.incorrecto){
                    this.mostrarAlerta('', rs.incorrecto.mensaje, 'error');
                    return;
                }
                this.reply = rs;
                //console.log('API response:', rs);
                if(rs.user.estado == 1){
                    const { id, nombre, apellido, email, telefono, documento, id_rol } = rs.user.user;
                    const simplifiedUser = { id, nombre, apellido, email, telefono, documento, id_rol };
                    if (this.reply) {
                        // this.reply.user.id_rol = Number(this.reply.user.id_rol);
                        //console.log('id_rol login',this.reply.user.id_rol);
                        sessionStorage.setItem('token', rs.token);
                        sessionStorage.setItem('identity', JSON.stringify(this.reply.user));
                        sessionStorage.setItem('currentRolName', this.getRoleName(Number(this.reply.user.id_rol)));
                        sessionStorage.setItem('currentUser', JSON.stringify(simplifiedUser))
                        this.token = this.reply.access_token;
                        if (this.reply.user) {
                            sessionStorage.setItem('documento', this.reply.user.documento);
                        }
                        if(this.reply.user.id_rol === 1){
                            setTimeout(() => {
                                this.router.navigate(['/dashboard']);
                            }, 2000);
                        } else {
                            setTimeout(() => {
                                this.router.navigate(['/hijo']);
                            }, 2000);
                        }
                        
                    }
                    this.isSubmitting = false;
                } else {
                    this.mostrarAlerta('Usuario Desactivado', 'Comuniquese con el Administrador', 'warning');
                    this.router.navigate(['/login']);
                }
                
            },
            err => {
                //console.error(err);
                if (err.status === 401) {
                    
                } else if (err.status === 404) {
                    
                } else if (err.status === 403) {
                    
                } else if (err.status === 410) {
                    
                }
                if (err.status === 409) {
                    // this.router.navigate(['/verification'], { queryParams: { email: email } });
                }
                setTimeout(() => {
                    this.isSubmitting = false;
                }, 2000);
            }
        );
        this.isSubmitting = false;
    }

    getRoleName(rolId: number | undefined | null): string {
        switch (rolId) {
            case 1:
                return 'SuperAdministrador';
            default:
                return 'Padre';
        }
    }

    // this.mostrarAlerta('', 'No Ingreso el Documento', 'error');

    // import Swal from 'sweetalert2';

    // funcion para las alertas del sistema
    mostrarAlerta(titulo: string ,mensaje: any, icono: any) {
        Swal.fire({
            title: titulo,
            icon: icono,
            text: mensaje,
            confirmButtonText: 'Aceptar',
            timer: 3000, // Duración en milisegundos (3 segundos)
            background: '#fff', // Color de fondo
            color: '#333', // Color del texto
            heightAuto: false,
            width: '450px',
            position: 'top',
            customClass: {
                popup: 'custom-popup'  // Aplica una clase personalizada para más ajustes (opcional)
            }
        });
    }

}
