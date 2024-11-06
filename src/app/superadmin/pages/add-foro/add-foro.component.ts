import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ForoComponent } from '../foro/foro.component';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn  } from '@angular/forms';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';

@Component({
  selector: 'app-add-foro',
  templateUrl: './add-foro.component.html',
  styleUrl: './add-foro.component.css'
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
  position: string = 'center';

  foroForm = this.fb.group({
    titulo: ['', Validators.required],
    contenido: ['', Validators.required],
    imagen: ['']
  });

  constructor(
    public _matDialogRef: MatDialogRef<AddForoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private superadminservice: SuperadminService,
    private fb: FormBuilder,
  ) {
    const datosobtenidosModal = {
      titulo: data?.titulo || null,
      contenido: data?.contenido || null,
    }
    this.foroForm.patchValue(datosobtenidosModal);
    this.editar = data?.editar || false;
    this.id = data?.id || null;
    console.log(datosobtenidosModal, this.editar, this.id)
  }

  // metodo para emite un señal cuando se inserto un dato 
  @Output() datosInsertado = new EventEmitter<void>();

  // metodo para cerrar la ventana modal
  cerrar(): void {
    this._matDialogRef.close();
  }

  // funcion para tomar los datos y enviarlos al API 
  tomarDatos(): void {
    if (!this.foroForm.invalid) {
      console.log('valido, agg datos')
      // tomamos los datos necesarios de los inputs que necesitamos
      const titulo = this.foroForm.get('titulo')?.value;
      const contenido = this.foroForm.get('contenido')?.value;
      const imagen = this.foroForm.get('imagen')?.value;

      console.log('usuario: '+this.documentoAdministrador, 'titulo: '+titulo, 'contenido: '+contenido, 'img: '+imagen, 'id: '+this.id, 'editar?: '+this.editar);

      if(this.editar == false){
        // Si es false guardara y hara lo siguiente
        this.superadminservice.guardarRegistroForo(this.documentoAdministrador, titulo, contenido).subscribe(response => {
          console.log('Respuesta del servidor:', response);

          // Emite el evento después de la inserción si fue exitosa
          this.datosInsertado.emit();
        }, error => {
          console.error('Error al enviar los datos:', error);
        });
        this.editar = false;
      } else {
        // Si es true editara y hara los siguiente
        this.superadminservice.editarRegistroForo(this.id, titulo, contenido).subscribe(response => {
          console.log('Respuesta del servidor:', response);
    
          // Emite el evento después de la inserción si fue exitosa
          this.datosInsertado.emit();
        }, error => {
          console.error('Error al enviar los datos:', error);
        });
        this.editar = false;
        this.cerrar();
      }  
    } else {
      alert('Faltan campos por rellenar');
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result !== undefined) {
          this.selectedImage = e.target.result as string | ArrayBuffer;
        }
      };
      reader.readAsDataURL(file);
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
