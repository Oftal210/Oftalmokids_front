import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../../Modelos/user.model';
import { AuthService } from '../../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      documento: ['', [Validators.required, this.documentoValidator]],
      nombre: ['', [Validators.required, this.noNumbersValidator]],
      apellido: ['', [Validators.required, this.noNumbersValidator]],
      telefono: ['', [Validators.required, this.celularValidator]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8),this.passwordValidator]],
      id_rol: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    // debugger
    if (this.registerForm.invalid) {
      console.error('El formulario no es válido');
      return;
    }

    this.isSubmitting = true;
    const user = new User(
      0, // El id se generará en el backend
      this.registerForm.get('documento')?.value,
      this.registerForm.get('nombre')?.value,
      this.registerForm.get('apellido')?.value,
      this.registerForm.get('telefono')?.value,
      this.registerForm.get('email')?.value,
      this.registerForm.get('contrasena')?.value,
      this.registerForm.get('id_rol')?.value

    );

    this.authService.registro(user).subscribe({
        next: (response: any) => {
          this.router.navigate(['/verificacion'], { queryParams: { email: response.email } });
          // console.log(response.email);
        },
        error: (error) => {
          console.error('Error al registrar', error);
          // Aquí deberías manejar el error, tal vez mostrando un mensaje al usuario
        }
      });
  }

  // Validators
  private documentoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.toString() ?? '';
    return value.length >= 5 && value.length <= 13 ? null : { lengthError: 'El número de documento debe tener entre 5 y 13 dígitos' };
  }

  private celularValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.toString() ?? '';
    return value.length >= 5 && value.length <= 10 ? null : { lengthError: 'El número de celular debe tener entre 5 y 10 dígitos' };
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    return hasUpperCase && hasSpecialChar ? null : { passwordStrength: 'La contraseña debe contener al menos una letra mayúscula y un carácter especial' };
  }

  private noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    return /\d/.test(control.value) ? { hasNumbers: 'El campo no debe contener números' } : null;
  }
}

