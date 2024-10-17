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
// export class RegistroComponent implements OnInit{
//   isSubmitting: boolean = false;
//   email: string = '';
//   registerForm: FormGroup = new FormGroup({});
  
//   constructor(
//     private fb: FormBuilder,
//     private registroService: AuthService,
//     private router: Router,
//   ){ }

//   ngOnInit():void{
//     this.registerForm = this.fb.group({
//       documento: ['', [Validators.required, this.documentoValidator]],
//       nombre: ['', [Validators.required, this.noNumbersValidator]],
//       apellido: ['', [Validators.required, this.noNumbersValidator]],
//       telefono: ['', [Validators.required, this.celularValidator]],
//       email: ['', [Validators.required, this.emailValidator]],
//       contrasena: ['', [Validators.required, this.passwordValidator]]
//     });
//   }

//   documentoValidator(control: AbstractControl): ValidationErrors | null {
//     const value = control.value ? control.value.toString() : '';
//     if (value.length < 5 || value.length > 13) {
//       return { lengthError: 'El número de documento debe tener entre 5 y 13 dígitos *' };
//     }
//     return null;
//   }

//   celularValidator(control: AbstractControl): ValidationErrors | null {
//     const value = control.value ? control.value.toString() : '';
//     if (value.length < 5 || value.length > 10) {
//       return { lengthError: 'El número de celular debe tener entre 5 y 10 dígitos *' };
//     }
//     return null;
//   }

//   passwordValidator(control: AbstractControl): ValidationErrors | null {
//     const value = control.value;
//     const hasUpperCase = /[A-Z]+/.test(value);
//     const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
//     if (hasUpperCase && hasSpecialChar) {
//       return null;
//     } else {
//       return { passwordStrength: 'La contraseña debe contener al menos una letra mayúscula y un carácter especial *' };
//     }
//   }

//   noNumbersValidator(control: AbstractControl): ValidationErrors | null {
//     const value = control.value;
//     const hasNumbers = /\d/.test(value);
//     if (hasNumbers) {
//       return { hasNumbers: 'El campo no debe contener números *' };
//     } else {
//       return null;
//     }
//   }

//   emailValidator(control: AbstractControl): ValidationErrors | null {
//     const value = control.value;
//     const hasAtSymbol = /@/.test(value);
//     if (!hasAtSymbol) {
//       return { emailInvalid: 'El correo debe ser válido *' };
//     } else {
//       return null;
//     }
//   }

//   get f() { return this.registerForm.controls; }

//   registro():void{
//     if (this.registerForm.invalid) {
//       console.log('el registro salio mal')
//       return 
//     }
//     const user = new User(
//       this.f.id.value,
//       this.f.documento.value,
//       this.f.nombre.value,
//       this.f.apellido.value,
//       this.f.telefono.value,
//       this.f.email.value,
//       this.f.contrasena.value,
//     );
//     this.registroService.registro(user).subscribe(
//       (response : any) => {
//         setTimeout(() => {
//           this.isSubmitting = false;
//           this.email = response.email;
//           this.router.navigate(['/verification'], { queryParams: { email: this.email } });
//         }, 3000)
//       },
//       (error) => {
//         console.log('error al registrar',error);
//       }
//     )
//   }

// }
export class RegistroComponent {
  // registerForm: FormGroup;
  // isSubmitting = false;

  // constructor(
  //   private fb: FormBuilder,
  //   private authService: AuthService,
  //   private router: Router
  // ) {
  //   this.registerForm = this.fb.group({
  //     documento: ['', [Validators.required, this.documentoValidator]],
  //     nombre: ['', [Validators.required, this.noNumbersValidator]],
  //     apellido: ['', [Validators.required, this.noNumbersValidator]],
  //     telefono: ['', [Validators.required, this.celularValidator]],
  //     email: ['', [Validators.required, Validators.email]],
  //     contrasena: ['', [Validators.required, this.passwordValidator]]
  //   });
  // }

  // ngOnInit(): void {}

  // onSubmit(): void {
  //   // debugger
  //   if (this.registerForm.invalid) {
  //     console.error('El formulario no es válido');
  //     return;
  //   }

  //   this.isSubmitting = true;
  //   const user = new User(
  //     0, // El id se generará en el backend
  //     this.registerForm.get('documento')?.value,
  //     this.registerForm.get('nombre')?.value,
  //     this.registerForm.get('apellido')?.value,
  //     this.registerForm.get('telefono')?.value,
  //     this.registerForm.get('email')?.value,
  //     this.registerForm.get('contrasena')?.value
  //   );

  //   this.authService.registro(user).subscribe({
  //       next: (response: any) => {
  //         this.router.navigate(['/verificacion'], { queryParams: { email: response.email } });
  //         // console.log(response.email);
  //       },
  //       error: (error) => {
  //         console.error('Error al registrar', error);
  //         // Aquí deberías manejar el error, tal vez mostrando un mensaje al usuario
  //       }
  //     });
  // }

  // // Validators
  // private documentoValidator(control: AbstractControl): ValidationErrors | null {
  //   const value = control.value?.toString() ?? '';
  //   return value.length >= 5 && value.length <= 13 ? null : { lengthError: 'El número de documento debe tener entre 5 y 13 dígitos' };
  // }

  // private celularValidator(control: AbstractControl): ValidationErrors | null {
  //   const value = control.value?.toString() ?? '';
  //   return value.length >= 5 && value.length <= 10 ? null : { lengthError: 'El número de celular debe tener entre 5 y 10 dígitos' };
  // }

  // private passwordValidator(control: AbstractControl): ValidationErrors | null {
  //   const value = control.value;
  //   const hasUpperCase = /[A-Z]+/.test(value);
  //   const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
  //   return hasUpperCase && hasSpecialChar ? null : { passwordStrength: 'La contraseña debe contener al menos una letra mayúscula y un carácter especial' };
  // }

  // private noNumbersValidator(control: AbstractControl): ValidationErrors | null {
  //   return /\d/.test(control.value) ? { hasNumbers: 'El campo no debe contener números' } : null;
  // }
}
