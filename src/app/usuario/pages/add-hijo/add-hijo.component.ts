import { Component, Inject, Output, EventEmitter, DebugElement } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { PadreService } from '../../../servicios/padre.service';
import { resolve } from 'path';
import { rejects } from 'assert';
import { resourceLimits } from 'worker_threads';
import { BlobOptions } from 'buffer';
import internal from 'stream';

@Component({
  selector: 'app-add-hijo',
  templateUrl: './add-hijo.component.html',
  styleUrl: './add-hijo.component.css'
})
export class AddHijoComponent {

  // variable para manejar la alertar
  verificacioDato = false;

  // variables para manejar el padre
  existePadre: boolean = false;
  // variable para tomar el documento de usuario
  documentoPadre = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');
  idPadre!: string;
  
  // variables para manejar el hijo
  existePaciente: boolean = false;
  edadPaciente!: number;
  documentoPaciente!: string;
  idPaciente: number = 0;

  // variable para guardar el valor para el atributo readonly
  isReadonly = true;

  // variable para verificar si es edicion o guardado
  editarHijo: boolean = false;

  // variables para la imagen
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null; 
 
  // metodo para validar el formulario de paciente
  pacienteForm = this.fb.group({
    tipodocumento:    ['', [Validators.required, this.validarSelect()]],
    documento:        ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
    nombre:           ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    apellido:         ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    fechanacimiento:  ['', [Validators.required, this.validarFecha()]],
    edad:             [''],
    genero:           ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
    direccion:        ['', Validators.required],
  });

  private unsubscribe$ = new Subject<void>();

  // metodo para emite un señal cuando se inserto un dato 
  @Output() datosInsertado = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private padreservice: PadreService,
    public _matDialogRef: MatDialogRef<AddHijoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    
    if(data){
      this.pacienteForm.patchValue(data);
      if(data.editar){
        this.editarHijo = true;
        this.idPaciente = data.id
        console.log(this.idPaciente)
      }
    }
  }

  ngOnInit() {
    // llamamos a la funcion para traer los datos
    this.buscarIdPadre();
  } 

  cerrar(): void {
    this._matDialogRef.close();
  }

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

  buscarIdPadre(): void {
    if (this.documentoPadre) {
      var docPadre = JSON.parse(this.documentoPadre);
      this.padreservice.buscarPadre(docPadre.documento)
      .pipe(takeUntil(this.unsubscribe$)).subscribe(
        data =>{
          if (!data.mensaje){
            this.idPadre = data.usuario.id;
          } else {
            alert('no hay cedula para insertar hijos')
          }
        })
    } else {
      alert('documento invalido')
    }    
  }

  //funcion para buscar a un paciente especifico
  buscarPaciente(): Promise<boolean> {
    // tomamos el valor del documento del padre que tenga
    const pacienteDoc = this.pacienteForm.get('documento')?.value;
    return new Promise((resolve, reject) => {
      this.padreservice.buscarPaciente(pacienteDoc).subscribe(data => {

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

  async tomarDatosPaciente(){

    const FotoHijo = new FormData();

    if(this.selectedFile) {
      const nombreUnico = `${Date.now()}-${this.selectedFile.name}`;
      FotoHijo.append('foto', this.selectedFile, nombreUnico); // IMPORTANTISIMO QUE ESTO TENGA EL MISMO VALOR QUE ESTE MENSAJE EN EL BACK
      console.log(FotoHijo)
    } else {
      FotoHijo.append('foto', ''); // AQUI TAMBIEN
    }
    
    FotoHijo.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

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

      if(this.editarHijo){

        // realizamos la edicion de los datos
        this.padreservice.modificarRegistroHijo(this.idPaciente, nombre, apellido, tipodocumento, direccion, FotoHijo)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          console.log('Respuesta del servidor:', response);
          console.log('Respuesta del servidor:', response.status);
          // Emite el evento después de la inserción si fue exitosa
          if (response.status == 200) {
            // Emite el evento después de la inserción si fue exitosa  ESTO ES SOLO PARA HIJO, PORQUE LA TABLA ES LA DE HIJO
            this.datosInsertado.emit();
            alert('el Hijo fue Actualizado Correctamente');
            this.cerrar();
          }
        }, error => {
          console.error('Error al enviar los datos:', error);
          alert('Error en el sistema vuelva a intentarlo');   // mostramos alerta
        });
        return;
      } else{

        if(this.documentoPadre){
          
          // realizamos una peticion y esperamos hasta que se complete
          await this.buscarPaciente();

          // cambiamos la variable para que no salgan las alertas ahora
          this.verificacioDato = false;

          if(!this.existePaciente) {
            // realizamos la insercion de los datos
            this.padreservice.guardarRegistroHijo(documento, this.idPadre, nombre, apellido, tipodocumento, fechanacimiento, this.edadPaciente, genero, direccion, FotoHijo)
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
            alert('El Paciente ya Esta Registrado');
          }
        } else {
          // cambiamos la variable para que no salgan las alertas ahora
          this.verificacioDato = false;
          // mostramos alertar de fallo
          alert('no tiene un documento valido para agregar')
        }
      }
    } else {
      console.log('datos fallidos')
      alert('Faltan Datos o Correciones en Paciente');
    }

    // cambiamos la variable para que no salgan las alertas ahora
    this.verificacioDato = false;
    this.verificarEstadoPaciente();
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

  // Se utiliza para subir la imagen
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      const fileType = file.type;
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];  // Tipos de imágenes válidas
  
      if (validTypes.includes(fileType)) {
        // Crear una URL para previsualizar la imagen
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result;
        };
        reader.readAsDataURL(file);  // Esto convierte la imagen en una cadena base64
        this.selectedFile = file;
        console.log(this.selectedFile);
      } else {
        alert('Por favor selecciona una imagen válida (JPEG, PNG)');
        this.selectedImage = null;
        this.selectedFile = null;
      }
    }
  }

  // Maneja el arrastre de un archivo
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Evita el comportamiento por defecto
  }

  // Maneja el soltar el archivo en el área
  onDrop(event: DragEvent): void {
    event.preventDefault(); // Evita el comportamiento por defecto
    const file = event.dataTransfer?.files[0]; // Obtiene el archivo arrastrado
    if (file) {
      this.onFileSelected({ target: { files: [file] } }); // Llama al método para manejar la selección
    }
  }

}
