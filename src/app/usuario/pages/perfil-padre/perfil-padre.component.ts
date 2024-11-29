import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn  } from '@angular/forms';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { PadreService } from '../../../servicios/padre.service';
import { AuthService } from '../../../servicios/auth.service';
import { use } from 'echarts';

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

  // variable para guardar los registros de los controles 
  controles: any[] = [];

  // variable para tomar el documento de usuario
  datosPadre = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');
  documentoPadre!: string;

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

    this.user = this.authService.getUser();

    const datosUser = {
      documento: this.user.documento,
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      telefono: this.user.telefono,
      email: this.user.email,
    }
    this.perfilForm.patchValue(datosUser);

    // buscamos el id del padre
    if (this.datosPadre) {
      this.documentoPadre = JSON.parse(this.datosPadre).documento;
    } else {
      alert('no se encontro un documento del padre');
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
    this.padreService.buscarPadre(this.user.documento)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        sessionStorage.setItem('currentUser', JSON.stringify(data.usuario));
        this.user = data.usuario;
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

    // le damos tiempo a que cargue las cajas con los datos
    setTimeout(() => {
      // realizamos una validacion a los datos en las cajas 
      this.perfilForm.updateValueAndValidity();
      // Marcar los campos como tocados para que se muestren los mensajes de error
      Object.keys(this.perfilForm.controls).forEach(key => {
        this.perfilForm.get(key)?.markAsTouched();
      });
    }, 1000);
    
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  tomarDatos(): void {
    if (!this.perfilForm.invalid) {

      //console.log('agregen datos')
      // tomamos los datos necesarios de los inputs que necesitamos
      const nombre    = this.perfilForm.get('nombre')?.value;
      const apellido  = this.perfilForm.get('apellido')?.value;
      const email     = this.perfilForm.get('email')?.value;
      const telefono  = this.perfilForm.get('telefono')?.value;
      const password  = this.perfilForm.get('password')?.value;

      this.padreService.modficarPadre(this.user.documento, nombre, apellido, email, telefono, password)
        .subscribe(response => {
          //console.log('Respuesta del servidor:', response);
          //console.log('status', response.status);
          if (response.status == 200) {
            // Emite el evento después de la inserción si fue exitosa
            alert(response.mensaje);
            setTimeout(() => {
              this.cargarDatosPerfil();
            }, 500);
          } else {
            alert(response.mensaje);
          }
        }, error => {
          console.error('Error al enviar los datos:', error);
          alert('Error en el sistema vuelva a intentarlo');
          window.location.reload();
      });
  
    } else {
      //console.log('faltan datos')
    }
  }

  cargarTiempoControl(): void {
    this.padreService.obtenerTiempoControl(this.documentoPadre)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      //console.log(data.status)
      if(data.status == 200 ) {
        // this.hijos = data;
        this.controles = data.datos;
        //console.log(this.controles)
      } else{
        alert(data.mensaje)
      }
    })
  }
}
