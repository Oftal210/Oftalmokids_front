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
    this.user =this.authService.getUser();
    

    // buscamos el id del padre
    if (this.datosPadre) {
      this.documentoPadre = JSON.parse(this.datosPadre).documento;
    } else {
      alert('no se encontro un documento del padre');
    }

    // llamamos a la funcion para traer los datos
    

    //llamamos a la funcion para traer los controles
    this.cargarTiempoControl();
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
    this.padreService.buscarPadre(this.documentoPadre)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
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
  
    } else {
      console.log('faltan datos')
    }
  }

  cargarTiempoControl(): void {
    this.padreService.obtenerTiempoControl(this.documentoPadre)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      console.log(data.status)
      if(data.status == 200 ) {
        // this.hijos = data;
        this.controles = data.datos;
        console.log(this.controles)
      } else{
        alert(data.mensaje)
      }
    })
  }

  // funcion para darle un formato a la fecha
  formatDate(dateString: string): string {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const date = new Date(dateString);
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  }

  verificarTiempoControl(): void {

  }

}
