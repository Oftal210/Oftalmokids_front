import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';
import { resolve } from 'path';
import { rejects } from 'assert';
import { resourceLimits } from 'worker_threads';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {

  // variable para el texto de los errores
  mensajeError: string | null = null;
  
  // varaible para validar la respuesta de la promesa
  adminEncontrado: boolean = false;

  // metodo para validar el formulario
  administradorForm = this.fb.group({
    documento: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]] ,
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  private unsubscribe$ = new Subject<void>();

  @Output() datosInsertado = new EventEmitter<void>();

  constructor(
    public _matDialogRef: MatDialogRef<AddAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private superadminservice: SuperadminService
  ) {}
  cerrar(): void {
    this._matDialogRef.close();
  }

  // metodo para evitar que se hagan mas 2 espacios seguidos
  onInputChangeEspacio(event: Event): void {
    // tomamos el input necesario
    const input = event.target as HTMLInputElement;
    // Reemplaza múltiples espacios por uno solo
    input.value = input.value.replace(/\s+/g, ' ');
    // Actualiza el valor en el FormControl
    this.administradorForm.get(input.name)?.setValue(input.value);    
  }

  // metodo para evitar que haya espacio entre caracteres
  onInputChangeNoEspacio(event: Event): void {
    // tomamos el input necesario
    const input = event.target as HTMLInputElement;
    // Reemplaza múltiples espacios por uno solo
    input.value = input.value.replace(/\s+/g, '').trim();
    // Actualiza el valor en el FormControl
    this.administradorForm.get(input.name)?.setValue(input.value);
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  buscarAdministrador(documento: any): Promise<boolean>{
    return new Promise((resolve, reject) =>{
      this.superadminservice.buscarAdministrador(documento).subscribe(
        data => {
          //console.log(data);
          if (!data.mensaje){
            this.adminEncontrado = true;
          } else {
            this.adminEncontrado = false;
          }
          resolve(this.adminEncontrado)
        }, error => {
          reject(error);
        });
    });
  }

  // funcion para guardar el administrador nuevo
  async tomarDatos() {
    if (!this.administradorForm.invalid) {
      //console.log('agregen datos')
      // tomamos los datos necesarios de los inputs que necesitamos
      const documento = this.administradorForm.get('documento')?.value;
      const nombre    = this.administradorForm.get('nombre')?.value;
      const apellido  = this.administradorForm.get('apellido')?.value;
      const email     = this.administradorForm.get('email')?.value;
      const telefono  = this.administradorForm.get('telefono')?.value;
      const password  = this.administradorForm.get('password')?.value;

      // variable para realizar la consulta si el admin existe
      const esperarAdminBuscado = await this.buscarAdministrador(documento);
      //console.log(email)
      if (!this.adminEncontrado) {
        // realizamos el envio de los datos
        this.superadminservice.guardarRegistroAdministrador(documento, 1, nombre, apellido, email, telefono, password).subscribe(response => {
          //console.log('Respuesta del servidor:', response);
          //console.log('Respuesta del servidor:', response.status);
          if (response.status != 400) {
            // Emite el evento después de la inserción si fue exitosa
            this.datosInsertado.emit();
            this.cerrar();
          }
        }, error => {
          console.error('Error al enviar los datos:', error);
          alert('Error en el sistema vuelva a intentarlo');
          this.cerrar();
        });
      } else {
        alert('El Usuario o Correo ya Estan Registrados');
      }
    } else {
      alert('Faltan Datos o Correciones');
    }
  }
}
