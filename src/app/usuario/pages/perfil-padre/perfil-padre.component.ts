import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn  } from '@angular/forms';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { PadreService } from '../../../servicios/padre.service';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-perfil-padre',
  templateUrl: './perfil-padre.component.html',
  styleUrl: './perfil-padre.component.css'
})
export class PerfilPadreComponent {
  // variable para guardar el nombre del usuario
  nombrePerfil!: string;

  // variable para guardar el apellido del usuario
  apellidoPerfil!: string;

  // variable para guardar el valor para el atributo readonly
  isReadonly = true;

  // variable para tomar el documento de usuario
  documentoPadre = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  user:any;
  private unsubscribe$ = new Subject<void>();
  
  // metodo para validar el formulario
  perfilForm = this.fb.group({
    documento: [''],
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [this.passwordValidator()]]
  });

  constructor(
    private fb: FormBuilder,
    private padreService: PadreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user =this.authService.getUser();
    
    // llamamos a la funcion para traer los datos
    
  }  

  // metodo para verificar que si la contraseña se modificara, sea de 8 minimo
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null; // Si está vacío, no hay error
      }
      return value.length >= 4 ? null : { minlength: true }; // Verifica la longitud mínima
    };
  }

  // metodo para evitar que se hagan mas 2 espacios seguidos
  onInputChangeEspacio(event: Event): void {
    // tomamos el input necesario
    const input = event.target as HTMLInputElement;
    // Reemplaza múltiples espacios por uno solo
    input.value = input.value.replace(/\s+/g, ' ');
    // Actualiza el valor en el FormControl
    this.perfilForm.get(input.name)?.setValue(input.value);    
  }

  // metodo para evitar que haya espacio entre caracteres
  onInputChangeNoEspacio(event: Event): void {
    // tomamos el input necesario
    const input = event.target as HTMLInputElement;
    // Reemplaza múltiples espacios por uno solo
    input.value = input.value.replace(/\s+/g, '').trim();
    // Actualiza el valor en el FormControl
    this.perfilForm.get(input.name)?.setValue(input.value);
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  // tomarDatos(): void {

  //   if (this.documentoPadre) {
  //     var docAdministrador = JSON.parse(this.documentoPadre);
  //   }

  //   if (!this.perfilForm.invalid) {
  //     console.log('agregen datos')
  //     // tomamos los datos necesarios de los inputs que necesitamos
  //     const nombre    = this.perfilForm.get('nombre')?.value;
  //     const apellido  = this.perfilForm.get('apellido')?.value;
  //     const email     = this.perfilForm.get('email')?.value;
  //     const telefono  = this.perfilForm.get('telefono')?.value;
  //     const password  = this.perfilForm.get('password')?.value;

  //     this.padreService.modficarPadre(docAdministrador.documento, nombre, apellido, email, telefono, password)
  //       .subscribe(response => {
  //         console.log('Respuesta del servidor:', response);
  //         console.log('Respuesta del servidor:', response.status);
  //         if (response.status != 400) {
  //           // Emite el evento después de la inserción si fue exitosa
  //           alert('datos actualizados')
  //           setTimeout(() => {
  //             this.cargarDatosPerfil();
  //           }, 1000);
  //         }
  //       }, error => {
  //         console.error('Error al enviar los datos:', error);
  //         alert('Error en el sistema vuelva a intentarlo');
  //         window.location.reload();
  //     });
  
  //   } else {
  //     console.log('faltan datos')
  //   }
  // }
}
