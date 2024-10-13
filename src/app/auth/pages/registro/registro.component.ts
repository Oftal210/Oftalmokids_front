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
export class RegistroComponent implements OnInit{
  
  isSubmitting: boolean = false;
  email: any;
  registerForm: any;

  constructor(
    private fb: FormBuilder,
    private registroService: AuthService,
    private router: Router,
  ){ }

  ngOnInit():void{
    this.registerForm = this.fb.group({
      documento: ['', [Validators.required, this.documentoValidator]],
      nombre: ['', [Validators.required, this.noNumbersValidator]],
      apellido: ['', [Validators.required, this.noNumbersValidator]],
      telefono: ['', [Validators.required, this.celularValidator]],
      email: ['', [Validators.required, this.emailValidator]],
      contrasena: ['', [Validators.required, this.passwordValidator]]
    });
  }

  documentoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value ? control.value.toString() : '';
    if (value.length < 5 || value.length > 13) {
      return { lengthError: 'El número de documento debe tener entre 5 y 13 dígitos *' };
    }
    return null;
  }

  celularValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value ? control.value.toString() : '';
    if (value.length < 5 || value.length > 10) {
      return { lengthError: 'El número de celular debe tener entre 5 y 10 dígitos *' };
    }
    return null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    if (hasUpperCase && hasSpecialChar) {
      return null;
    } else {
      return { passwordStrength: 'La contraseña debe contener al menos una letra mayúscula y un carácter especial *' };
    }
  }

  noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasNumbers = /\d/.test(value);

    if (hasNumbers) {
      return { hasNumbers: 'El campo no debe contener números *' };
    } else {
      return null;
    }
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasAtSymbol = /@/.test(value);

    if (!hasAtSymbol) {
      return { emailInvalid: 'El correo debe ser válido *' };
    } else {
      return null;
    }
  }

  get f() { return this.registerForm.controls; }

  registro():void{
    if (this.registerForm.invalid) {
      console.log('el registro salio mal')
      return 
    }
    const user = new User(
      this.f.id.value,
      this.f.documento.value,
      this.f.nombre.value,
      this.f.apellido.value,
      this.f.telefono.value,
      this.f.email.value,
      this.f.contrasena.value,
    );
    this.registroService.registro(user).subscribe(
      (response : any) => {
        setTimeout(() => {
          this.isSubmitting = false;
          this.email = response.email;
          //this.router.navigate(['/verification'], { queryParams: { email: this.email } });
        }, 3000)
      },
      (error) => {
        console.log('error al registrar',error);
      }
    )
  }

}
