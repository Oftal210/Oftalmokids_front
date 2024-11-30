import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ForoComponent } from '../foro/foro.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';

@Component({
  selector: 'app-add-foro',
  templateUrl: './add-foro.component.html',
  styleUrl: './add-foro.component.css',
})
export class AddForoComponent {
  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // tomamos el texto del input de titulo
  inputTitulo!: string;

  // tomamos el texto del input de contenido
  inputContenido!: string;

  // variable para saber si edita o guarda
  editar = false;

  // variable para guardar el id del foro
  id = 0;

  // variable para colocarle readonly a los campos segun el rol
  readonlyRol: boolean = false;

  // variables para la imagen
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  rutaImagenForo: string = '';
  imageError: boolean = false; // Estado del error


  // nombre para la imagen en caso de que no salga
  nombreImagenError: string = '';


  // variable para tomar el rol de usuario
  rolUsuarioActual!: number;

  foroForm = this.fb.group({
    titulo: ['', Validators.required],
    contenido: ['', Validators.required],
    imagen: [''],
  });

  constructor(
    public _matDialogRef: MatDialogRef<AddForoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private superadminservice: SuperadminService,
    private fb: FormBuilder,
    private router: Router, 
  ) {
    // de la funcion de editar tomamos los datos y los almacenamos
    const datosobtenidosModal = {
      titulo: data?.titulo || null,
      contenido: data?.contenido || null,
      imagen: data?.ruta_imagen || null,
    };
    // con los datos almancenados los colocamos en su lugar correspondiente
    this.foroForm.patchValue(datosobtenidosModal);

    // validamos el rol de usuario
    if (this.documentoAdministrador) {

      // convertimos la variable a tipo JSON
      var docAdministrador = JSON.parse(this.documentoAdministrador);

      // tomamos el id_rol y lo guardamos aparte
      this.rolUsuarioActual = docAdministrador.id_rol; 

      // validamos segun el rol, el readonly para las diferentes cajas
      if(this.rolUsuarioActual == 1){
        this.readonlyRol = false;
      } else {
        this.readonlyRol = true;
      }

    } else {
      //console.log('saca del sistema, no hay json');
      this.router.navigate(['/login']);
    }

    // tomamos la ruta de la imagen de los datos almacenamdos
    this.rutaImagenForo = datosobtenidosModal.imagen;
    // tomamos el titulo para colocarlo en la imagen 
    this.nombreImagenError = datosobtenidosModal.titulo;

    // validamos el rol para verificar la edicion
    if(this.rolUsuarioActual == 1){
      this.editar = data?.editar || false;
    } else {
      this.editar = false;
    }
    
    // tomamos el id del foro para usarlo mas adelante
    this.id = data?.id || null;
  }

  // metodo para emite un señal cuando se inserto un dato
  @Output() datosInsertado = new EventEmitter<void>();

  // metodo para cerrar la ventana modal
  cerrar(): void {
    //console.log('entro cerr')
    this._matDialogRef.close();
  }

  // funcion para tomar los datos y enviarlos al API
  tomarDatos(): void {
    if (this.documentoAdministrador) {
      var docAdministrador = JSON.parse(this.documentoAdministrador);
      if (docAdministrador.id_rol == 1) {
        if (!this.foroForm.invalid) {
          //console.log('valido, agg datos');
          // tomamos los datos necesarios de los inputs que necesitamos
          const titulo = this.foroForm.get('titulo')?.value;
          const contenido = this.foroForm.get('contenido')?.value;
  
          const imagenData = new FormData();
  
          if(this.selectedFile) {
            const nombreUnico = `${Date.now()}-${this.selectedFile.name}`;
            imagenData.append('imagen', this.selectedFile, nombreUnico);
            //console.log(imagenData)
          } else {
            imagenData.append('imagen', '');
          }
          
          imagenData.forEach((value, key) => {
            //console.log(`${key}:`, value);
          });
  
          //console.log(
          //   'usuario: ' + imagenData,
          //   'titulo: ' + titulo,
          //   'contenido: ' + contenido,
          //   'img: ' + imagenData,
          //   'id: ' + this.id,
          //   'editar?: ' + this.editar
          // );
  
          if (this.editar == false) {
            // Si es false guardara y hara lo siguiente
            this.superadminservice
              .guardarRegistroForo(docAdministrador.documento, titulo, contenido, imagenData)
              .subscribe(
                (response) => {
                  //console.log('Respuesta del servidor:', response);
                  if(!response.mensaje){
                    // Emite el evento después de la inserción si fue exitosa
                    this.datosInsertado.emit();
                    this.cerrar();
                  } else{
                    //console.log('fallo en el sistema');
                  };
                },
                (error) => {
                  //console.error('Error al enviar los datos:', error);
                  this.mostrarAlerta('Formulario Incompleto', 'Ocurrio un error, intentelo de nuevo', 'error');
                }
              );
            this.editar = false;
            
          } else {
            // Si es true editara y hara los siguiente
            this.superadminservice
              .editarRegistroForo(this.id, titulo, contenido, imagenData)
              .subscribe(
                (response) => {
                  //console.log('Respuesta del servidor:', response);
                  // Emite el evento después de la inserción si fue exitosa
                  this.datosInsertado.emit();
                  this.cerrar();
                },
                (error) => {
                  //console.error('Error al enviar los datos:', error);
                  this.mostrarAlerta('Formulario Incompleto', 'Ocurrio un error, intentelo de nuevo', 'error');
                }
              );
            this.editar = false;
            
          }
        } else {
          this.mostrarAlerta('Formulario Incompleto', 'Faltan campos por rellenar', 'error');
        }
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      const fileType = file.type;
      const fileSizeLimit = 2 * 1024 * 1024; // 2 MB en bytes
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];  // Tipos de imágenes válidas
  
      if (validTypes.includes(fileType)) {
        // Crear una URL para previsualizar la imagen
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result;
        };
        reader.readAsDataURL(file);  // Esto convierte la imagen en una cadena base64
        this.selectedFile = file;
        //console.log(this.selectedFile);
      } else {
        this.mostrarAlerta('Formato Invalido', 'Por favor selecciona una imagen válida (JPEG, PNG)', 'info');
        this.selectedImage = null;
        this.selectedFile = null;
      }

      if (file.size > fileSizeLimit) {
        this.mostrarAlerta('', 'El archivo excede el tamaño máximo permitido de 2 MB.', 'info');
        this.selectedImage = null;
        this.selectedFile = null;
        return;
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

  // Función que se ejecuta si ocurre un error al cargar la imagen
  onImageError(): void {
    this.imageError = true;
  }

  // funcion para las alertas del sistema
  mostrarAlerta(titulo: string ,mensaje: any, icono: any) {
    Swal.fire({
        title: titulo,
        icon: icono,
        text: mensaje,
        confirmButtonText: 'Aceptar',
        timer: 3000, // Duración en milisegundos (3 segundos)
        background: '#fff', // Color de fondo
        color: '#333', // Color del texto
        heightAuto: false,
        width: '450px',
        position: 'top',
        customClass: {
            popup: 'custom-popup'  // Aplica una clase personalizada para más ajustes (opcional)
        }
    });
}
}
