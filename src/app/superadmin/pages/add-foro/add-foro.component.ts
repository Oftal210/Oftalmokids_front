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

  // variables para la imagen
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null; 

  foroForm = this.fb.group({
    titulo: ['', Validators.required],
    contenido: ['', Validators.required],
    imagen: [''],
  });

  constructor(
    public _matDialogRef: MatDialogRef<AddForoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private superadminservice: SuperadminService,
    private fb: FormBuilder
  ) {
    const datosobtenidosModal = {
      titulo: data?.titulo || null,
      contenido: data?.contenido || null,
    };
    this.foroForm.patchValue(datosobtenidosModal);
    this.editar = data?.editar || false;
    this.id = data?.id || null;
    console.log(datosobtenidosModal, this.editar, this.id);
  }

  // metodo para emite un señal cuando se inserto un dato
  @Output() datosInsertado = new EventEmitter<void>();

  // metodo para cerrar la ventana modal
  cerrar(): void {
    this._matDialogRef.close();
  }

  // funcion para tomar los datos y enviarlos al API
  tomarDatos(): void {
    if (this.documentoAdministrador) {
      var docAdministrador = JSON.parse(this.documentoAdministrador);
      console.log(docAdministrador.documento);

      if (!this.foroForm.invalid) {
        console.log('valido, agg datos');
        // tomamos los datos necesarios de los inputs que necesitamos
        const titulo = this.foroForm.get('titulo')?.value;
        const contenido = this.foroForm.get('contenido')?.value;

        const imagenData = new FormData();

        if(this.selectedFile) {
          const nombreUnico = `${Date.now()}-${this.selectedFile.name}`;
          imagenData.append('imagen', this.selectedFile, nombreUnico);
          console.log(imagenData)
        } else {
          imagenData.append('imagen', '');
        }
        
        imagenData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });

        console.log(
          'usuario: ' + imagenData,
          'titulo: ' + titulo,
          'contenido: ' + contenido,
          'img: ' + imagenData,
          'id: ' + this.id,
          'editar?: ' + this.editar
        );

        if (this.editar == false) {
          // Si es false guardara y hara lo siguiente
          this.superadminservice
            .guardarRegistroForo(docAdministrador.documento, titulo, contenido, imagenData)
            .subscribe(
              (response) => {
                console.log('Respuesta del servidor:', response);
                if(!response.mensaje){
                  // Emite el evento después de la inserción si fue exitosa
                  this.datosInsertado.emit();
                  this.cerrar();
                } else{
                  console.log('fallo en el sistema');
                };
              },
              (error) => {
                console.error('Error al enviar los datos:', error);
              }
            );
          this.editar = false;
          
        } else {
          // Si es true editara y hara los siguiente
          this.superadminservice
            .editarRegistroForo(this.id, titulo, contenido)
            .subscribe(
              (response) => {
                console.log('Respuesta del servidor:', response);

                // Emite el evento después de la inserción si fue exitosa
                this.datosInsertado.emit();
              },
              (error) => {
                console.error('Error al enviar los datos:', error);
              }
            );
          this.editar = false;
          this.cerrar();
        }
      } else {
        alert('Faltan campos por rellenar');
      }
    }
  }

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

  // moveImage(direction: string): void {
  //   switch (direction) {
  //     case 'left':
  //       this.position = 'left';
  //       break;
  //     case 'center':
  //       this.position = 'center';
  //       break;
  //     case 'right':
  //       this.position = 'right';
  //       break;
  //   }
  // }
}
