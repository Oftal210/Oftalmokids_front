import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn  } from '@angular/forms';
import { Router } from '@angular/router';


// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  // variable para guardar el nombre del usuario
  nombrePerfil!: string;

  // variable para guardar el apellido del usuario
  apellidoPerfil!: string;

  // variable para guardar el valor para el atributo readonly
  isReadonly = true;

  user: any;

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

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
    private superadminservice: SuperadminService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser(); 
    const datosUser = {
      documento: this.user.documento,
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      telefono: this.user.telefono,
      email: this.user.email,
    }
    this.perfilForm.patchValue(datosUser);

    // verificamos el rol para sacarlo al login
    if (this.documentoAdministrador) {
      var docAdministrador = JSON.parse(this.documentoAdministrador);
      if(docAdministrador.id_rol != 1){
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
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

  // meotdo para buscar los datos del usuario
  cargarDatosPerfil() {
    if(this.user.id == 1){
      this.superadminservice.buscarSuperAdministrador(this.user.documento)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        sessionStorage.setItem('currentUser', JSON.stringify(data.usuario));
        const datosobtenidos = {
          documento: data.usuario.documento,
          nombre: data.usuario.nombre,
          apellido: data.usuario.apellido,
          telefono: data.usuario.telefono,
          email: data.usuario.email,
        }
        this.perfilForm.patchValue(datosobtenidos);
        this.nombrePerfil = data.usuario.nombre;
        this.apellidoPerfil = data.usuario.apellido;
      })
    } else {
      this.superadminservice.buscarAdministrador(this.user.documento)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        sessionStorage.setItem('currentUser', JSON.stringify(data.usuario));
        const datosobtenidos = {
          documento: data.usuario.documento,
          nombre: data.usuario.nombre,
          apellido: data.usuario.apellido,
          telefono: data.usuario.telefono,
          email: data.usuario.email,
        }
        this.perfilForm.patchValue(datosobtenidos);
        this.nombrePerfil = data.usuario.nombre;
        this.apellidoPerfil = data.usuario.apellido;
      })    
    }

    // le damos tiempo a que cargue las cajas con los datos
    setTimeout(() => {
      // Marcar los campos como tocados para que se muestren los mensajes de error
      Object.keys(this.perfilForm.controls).forEach(key => {
        this.perfilForm.get(key)?.markAsTouched();
      });
      // realizamos una validacion a los datos en las cajas 
      this.perfilForm.updateValueAndValidity();
    }, 500);
    
  }
 
  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  tomarDatos(): void {

    if (this.documentoAdministrador) {
      var docAdministrador = JSON.parse(this.documentoAdministrador);
    }

    if (!this.perfilForm.invalid) {
      console.log('agregen datos')
      // tomamos los datos necesarios de los inputs que necesitamos
      const nombre    = this.perfilForm.get('nombre')?.value;
      const apellido  = this.perfilForm.get('apellido')?.value;
      const email     = this.perfilForm.get('email')?.value;
      const telefono  = this.perfilForm.get('telefono')?.value;
      const password  = this.perfilForm.get('password')?.value;

      if(this.user.id == 1) {
        this.superadminservice.modficarSuperAdministrador(this.user.documento, nombre, apellido, email, telefono, password)
        .subscribe(response => {
          console.log('Respuesta del servidor:', response);
          console.log('Respuesta del servidor:', response.status);
          if (response.status == 200) {
            // Emite el evento después de la inserción si fue exitosa
            alert(response.mensaje);
            setTimeout(() => {
              this.cargarDatosPerfil();
            }, 1000);
          } else {
            alert(response.mensaje);
          }
        }, error => {
          console.error('Error al enviar los datos:', error);
          alert('Error en el sistema vuelva a intentarlo');
          window.location.reload();
        });
      } else {
        this.superadminservice.modficarAdministrador(docAdministrador.documento, nombre, apellido, email, telefono, password)
        .subscribe(response => {
          console.log('Respuesta del servidor:', response);
          console.log('Respuesta del servidor:', response.status);
          if (response.status != 400) {
            // Emite el evento después de la inserción si fue exitosa
            alert('datos actualizados')
            setTimeout(() => {
              this.cargarDatosPerfil();
            }, 1000);
          }
        }, error => {
          console.error('Error al enviar los datos:', error);
          alert('Error en el sistema vuelva a intentarlo');
          window.location.reload();
        });
      }
      

    } else {
      console.log('faltan datos')
      console.log(this.perfilForm.get('nombre')?.valid);
    }
  }
}
