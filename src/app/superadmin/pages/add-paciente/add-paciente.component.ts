import { Component, Inject, Output, EventEmitter, DebugElement } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';
import { resolve } from 'path';
import { rejects } from 'assert';
import { resourceLimits } from 'worker_threads';
import { BlobOptions } from 'buffer';
import internal from 'stream';

@Component({
  selector: 'app-add-paciente',
  templateUrl: './add-paciente.component.html',
  styleUrl: './add-paciente.component.css'
})
export class AddPacienteComponent {

  // variable para manejar la alertar
  verificacioDato = false;

  // variables para manejar el padre
  existePadre: boolean = false;
  documentoPadre!: string;

  // variables para manejar el hijo
  existePaciente: boolean = false;
  edadPaciente!: number;
  documentoPaciente!: string;

  // variable para guardar el valor para el atributo readonly
  isReadonly = true;

  // metodo para validar el formulario de padre
  padreForm = this.fb.group({
    documento: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

 
  // metodo para validar el formulario de paciente
  pacienteForm = this.fb.group({
    tipodocumento: ['', [Validators.required, this.validarSelect()]],
    documento: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    fechanacimiento: ['', [Validators.required, this.validarFecha()]],
    edad: [''],
    genero: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    direccion: ['', Validators.required]
  });
  
  private unsubscribe$ = new Subject<void>();

  // metodo para emite un señal cuando se inserto un dato 
  @Output() datosInsertado = new EventEmitter<void>();

  constructor(
    private superadminservice: SuperadminService,
    public _matDialogRef: MatDialogRef<AddPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {}  

  // metodo para cerrar la ventana modal
  cerrar(): void {
    this._matDialogRef.close();
  }

  // FUNCIONES DE VALIDACION PARA EL PADRE
  // metodo para evitar que se hagan mas 2 espacios seguidos para el padre
  onInputChangeEspacioPadre(event: Event): void {
    // tomamos el input necesario
    const input = event.target as HTMLInputElement;
    // Reemplaza múltiples espacios por uno solo
    input.value = input.value.replace(/\s+/g, ' ');
    // Actualiza el valor en el FormControl
    this.padreForm.get(input.name)?.setValue(input.value);    
  }

  // metodo para evitar que haya espacio entre caracteres para el padre
  onInputChangeNoEspacioPadre(event: Event): void {
    // tomamos el input necesario
    const input = event.target as HTMLInputElement;
    // Reemplaza múltiples espacios por uno solo
    input.value = input.value.replace(/\s+/g, '').trim();
    // Actualiza el valor en el FormControl
    this.padreForm.get(input.name)?.setValue(input.value);
  }
  // FUNCIONES DE VALIDACION PARA EL PADRE


  // FUNCIONES  DE VALIDACION PARA EL HIJO
  // metodo para evitar que se hagan mas 2 espacios seguidos para el hijo
  onInputChangeEspacioPaciente(event: Event): void {
    // tomamos el input necesario
    const input = event.target as HTMLInputElement;
    // Reemplaza múltiples espacios por uno solo
    input.value = input.value.replace(/\s+/g, ' ');
    // Actualiza el valor en el FormControl
    this.pacienteForm.get(input.name)?.setValue(input.value);    
  }

  // metodo para evitar que haya espacio entre caracteres para el hijo
  onInputChangeNoEspacioPaciente(event: Event): void {
    // tomamos el input necesario
    const input = event.target as HTMLInputElement;
    // Reemplaza múltiples espacios por uno solo
    input.value = input.value.replace(/\s+/g, '').trim();
    // Actualiza el valor en el FormControl
    this.pacienteForm.get(input.name)?.setValue(input.value);
  }

  // metodo para validar el valor del select y que no sea vacio
  validarSelect() {
    return (control: AbstractControl) => {
      // validamos que la opcion seleccionada no sea "Seleccion uno" que esta invisible en el DOM
      return control.value === '' ? { seleccionInvalida: true } : null;
    };
  }

  // metodo para validar que la fecha sea igual inferior a la actual
  validarFecha() {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaSeleccionada = new Date(control.value);
      const fechaActual = new Date(); // tomamos la fecha actual
      const fechaMinima = new Date(
        // sacamos los calculos necesarios
        fechaActual.getFullYear() - 17, // calculo del año
        fechaActual.getMonth(),         // calculo del mes
        fechaActual.getDate()           // tomamos el dato
      );
      // validamos que la fecha sea igual o menor a hoy
      if (fechaSeleccionada > fechaActual) {
        return { fechaInvalida: true }; // si es dejamos pasar
      }
      // validamos que la fecha sea como mucho igual o menor a 17
      if (fechaSeleccionada < fechaMinima) {
        return { fechaInvalida: true }; // si es dejamos pasar
      }
      return null;
    };
  }

  // funcion para calcular la edad del paciente
  EdadPaciente(event: Event): void {
    // declaramos y tomamos el valor necesario
    const edadpaciente = this.pacienteForm.get('fechanacimiento')?.value as string | null | undefined;
    // validamos que haya un valor valido
    if (edadpaciente) { 
      console.log('aqui no')
      // tomamos la fecha actual
      const fechaActual = new Date();
      // convertimos la fecha a tipo date
      const fechaNacimiento = new Date(edadpaciente);
      // realizamos el calculo de la edad
      let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
      // realizamos el calculo de meses hasta la fecha de nacimeiento
      const mes = fechaActual.getMonth() - fechaNacimiento.getMonth();
      // verificamos si faltan meses para la fecha de nacimiento
      if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())){
        edad--; // en caso de que falte se le restara
      }
      // retornamos la edad en el lugar de llamada
      if (edad >= 0 && edad <= 17) {
        this.edadPaciente = edad;
      }
    }
  }
  // FUNCIONES  DE VALIDACION PARA EL HIJO


  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para buscar a un PADRE especifico
  buscarPadre(): Promise<boolean> {
    // tomamos el valor del documento del padre que tenga
    const padreDoc = this.padreForm.get('documento')?.value;
    return new Promise((resolve, reject) => {
      this.superadminservice.buscarPadre(padreDoc).subscribe(data => {
        
        // validmaos que el status sea correcto
        if (data.status == 200){
          // tomamos los datos de la consulta hecha y los gestionamos
          const datosObtenidosPadre = {
            documento: data.usuario.documento,
            nombre: data.usuario.nombre,
            apellido: data.usuario.apellido,
            telefono: data.usuario.telefono,
            email: data.usuario.email,
          }
          this.padreForm.patchValue(datosObtenidosPadre); // colocamos los datos en el formulario segun la anteriro variable
          this.existePadre = true;                        // seteamos el valor para validar
          this.documentoPadre = data.usuario.id;          // tomamos el documento del padre para manejarlo mas facil

          console.log(this.existePadre);
          console.log(this.documentoPadre);

          // validamos si es necesario mostrar la alerta
          if(this.verificacioDato == false){
            alert('Ya se encuentra registrado este padre');
          }
        } else {
          if (this.existePadre == true) {  // validamos si hubo datos antes
            this.padreForm.reset();           // limpiamos las cajas del formulario de padre
          }
          
          this.existePadre = false;   // seteamos el valor para validar

          console.log(this.verificacioDato);

          // validamos si es necesario mostrar la alerta
          if(this.verificacioDato == false){
            alert('No se encuentra registrado el padre');
          }
        }
        resolve(this.existePadre);
      }, error => {
        reject(error);
      });
    });
  }

  //funcion para buscar a un paciente especifico
  buscarPaciente(): Promise<boolean> {
    // tomamos el valor del documento del padre que tenga
    const pacienteDoc = this.pacienteForm.get('documento')?.value;
    return new Promise((resolve, reject) => {
      this.superadminservice.buscarPaciente(pacienteDoc).subscribe(data => {

        // validmaos que el status sea correcto
        if (data.status == 200){
          console.log(data);
          // tomamos los datos de la consulta hecha y los gestionamos
          const datosObtenidosPaciente = {
            tipodocumento: data.hijo.tipo_documento,
            documento: data.hijo.documento,
            nombre: data.hijo.nombre,
            apellido: data.hijo.apellido,
            fechanacimiento: data.hijo.fecha_nacimiento,
            genero: data.hijo.genero,
            edad: data.hijo.edad
          }
          this.pacienteForm.patchValue(datosObtenidosPaciente); // colocamos los datos en el formulario segun la anteriro variable
          this.existePaciente = true;                           // seteamos el valor para validar                    
          this.documentoPaciente = data.hijo.documento;         // tomamos el documento del padre para manejarlo mas facil

          console.log(this.existePaciente);
          console.log(this.documentoPaciente);

          // validamos si es necesario mostrar la alerta
          if(this.verificacioDato == false){
            alert('Ya se encuentra registrado este paciente');
          }
        } else {
          if(this.existePaciente == true) {   // validamos si hubo datos antes
            this.pacienteForm.reset();        // limpiamos las cajas del formulario de padre
          }
          this.existePaciente = false;      // seteamos el valor para validar

          console.log(this.verificacioDato);

          // validamos si es necesario mostrar la alerta
          if(this.verificacioDato == false){
            alert('No se encuentra registrado el hijo');
          }
        }
        resolve(this.existePaciente);
      }, error => {
        reject(error);
      }); 
    });
  }


  async tomarDatosPadre(){ 
    // si el formulario no es invalido hacemos
    if(!this.padreForm.invalid) {
      console.log('agregen datos')
      // tomamos los datos necesarios de los inputs que necesitamos
      const documento = this.padreForm.get('documento')?.value;
      const nombre    = this.padreForm.get('nombre')?.value;
      const apellido  = this.padreForm.get('apellido')?.value;
      const email     = this.padreForm.get('email')?.value;
      const telefono  = this.padreForm.get('telefono')?.value;
      const password  = this.padreForm.get('password')?.value;

      // cambiamos la variable para que no salgan las alertas ahora
      this.verificacioDato = true;

      // realizamos una peticion y esperamos hasta que se complete
      await this.buscarPadre();

      // cambiamos la variable para que no salgan las alertas ahora
      this.verificacioDato = false;

      // si no existe el padre lo agregamos
      if(!this.existePadre){
        // realizamos la insercion de los datos
        this.superadminservice.guardarRegistroPadre(documento, 2, nombre, apellido, email, telefono,  password)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          console.log('Respuesta del servidor:', response);
          console.log('Respuesta del servidor:', response.status);
          // Emite el evento después de la inserción si fue exitosa
          if (response.status != 400) {
            // Emite el evento después de la inserción si fue exitosa  ESTO ES SOLO PARA HIJO, PORQUE LA TABLA ES LA DE HIJO
            alert('el Padre fue Guardado Correctamente');
          }
        }, error => {   // si encontramos un error lo vemos de la siguiente manera
          console.error('Error al enviar los datos:', error);  
          alert('Error en el sistema vuelva a intentarlo');   // mostramos alerta
        });
      } else {
        alert('El Usuario o Correo ya Estan Registrados');
      }
    } else {
      console.log('datos fallidos')
      alert('Faltan Datos o Correciones en Padre');
    }

    console.log('fun tomardatospadre')
    this.verificarEstadoPadre();
  }


  async tomarDatosPaciente(){ 
    // si el formulario no es invalido hacemos
    if(!this.pacienteForm.invalid) {
      console.log('agregen datos')
      // tomamos los datos necesarios de los inputs que necesitamos
      const tipodocumento   = this.pacienteForm.get('tipodocumento')?.value;
      const documento       = this.pacienteForm.get('documento')?.value;
      const nombre          = this.pacienteForm.get('nombre')?.value;
      const apellido        = this.pacienteForm.get('apellido')?.value;
      const fechanacimiento = this.pacienteForm.get('fechanacimiento')?.value;
      const genero          = this.pacienteForm.get('genero')?.value;
      const direccion       = this.pacienteForm.get('direccion')?.value;

      // cambiamos la variable para que no salgan las alertas ahora
      this.verificacioDato = true;

      // realizamos una peticion y esperamos hasta que se complete
      await this.buscarPadre();

      if(this.existePadre){
        // realizamos una peticion y esperamos hasta que se complete
        await this.buscarPaciente();

        // cambiamos la variable para que no salgan las alertas ahora
        this.verificacioDato = false;

        if(!this.existePaciente) {
          // realizamos la insercion de los datos
          this.superadminservice.guardarRegistroHijo(documento, this.documentoPadre, nombre, apellido, tipodocumento, fechanacimiento, this.edadPaciente, genero, direccion)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => {
            console.log('Respuesta del servidor:', response);
            console.log('Respuesta del servidor:', response.status);
            // Emite el evento después de la inserción si fue exitosa
            if (response.status != 400) {
              // Emite el evento después de la inserción si fue exitosa  ESTO ES SOLO PARA HIJO, PORQUE LA TABLA ES LA DE HIJO
              this.datosInsertado.emit();
              alert('el Hijo fue Guardado Correctamente');
              this.pacienteForm.reset();
              this.cerrar();
            }
          }, error => {
            console.error('Error al enviar los datos:', error);
            alert('Error en el sistema vuelva a intentarlo');   // mostramos alerta
          });
        } else {
          // cambiamos la variable para que no salgan las alertas ahora
          this.verificacioDato = false;
          // mostramos alertar de fallo
          alert('El Paciente o Correo ya Estan Registrados');
        }
      } else {
        // cambiamos la variable para que no salgan las alertas ahora
        this.verificacioDato = false;
        // mostramos alertar de fallo
        alert('La Cedula del Padre no se Encuentra Registrada')
      }
    } else {
      console.log('datos fallidos')
      alert('Faltan Datos o Correciones en Paciente');
    }

    // cambiamos la variable para que no salgan las alertas ahora
    this.verificacioDato = false;
    console.log('fun tomardatospaciente');
    this.verificarEstadoPaciente();
  }

  verificarEstadoPadre() {
    // Verifica si el formulario es inválido
    if (this.padreForm.invalid) {
      // Itera sobre cada control del formulario
      for (const controlName in this.padreForm.controls) {
        if (this.padreForm.controls.hasOwnProperty(controlName)) {
          const control = this.padreForm.get(controlName) as FormControl; // Usa get para obtener el control
          if (control && control.invalid) {
            // Imprimir el nombre del control y su estado
            console.log(`${controlName} es inválido:`, control.errors);
          } else {
            console.log(`${controlName} es válido`);
          }
        }
      }
    } else {
      console.log('El formulario es válido');
    }
  }

  verificarEstadoPaciente() {
    // Verifica si el formulario es inválido
    if (this.pacienteForm.invalid) {
      // Itera sobre cada control del formulario
      for (const controlName in this.pacienteForm.controls) {
        if (this.pacienteForm.controls.hasOwnProperty(controlName)) {
          const control = this.pacienteForm.get(controlName) as FormControl; // Usa get para obtener el control
          if (control && control.invalid) {
            // Imprimir el nombre del control y su estado
            console.log(`${controlName} es inválido:`, control.errors);
          } else {
            console.log(`${controlName} es válido`);
          }
        }
      }
    } else {
      console.log('El formulario es válido');
    }
  }


}
