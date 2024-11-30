import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../servicios/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {
  
  contrasenaForm: FormGroup;
  isSubmitting = false;

  ngOnInit() {
    // verificamos el rol para sacarlo al login
    this.router.navigate(['/recuperar-contrasena']);
    console.log('hola');
    //debugger;
    
  }

  constructor(
    private recuperarContrasenaService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) { 
    this.contrasenaForm = this.fb.group({
      email: ['']
    });
  }

  constrasena():void{
    if (this.contrasenaForm.invalid) {
      console.error('El formulario no es válido');
      return;
    }
    
    this.isSubmitting = true;

    const email = this.contrasenaForm.get('email')?.value;
    this.recuperarContrasenaService.recuperarContrasena(email).subscribe({
      next: () => {
        console.log('Correo de recuperación enviado');
        this.router.navigate(['/registro']);
      },
      error: (error) => {
        console.error('Error al recuperar contraseña', error);
      }
    });
  }
}
