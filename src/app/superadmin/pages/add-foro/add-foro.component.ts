import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuperadminService } from '../../../servicios/superadmin.service';
import { ForoComponent } from '../foro/foro.component';

@Component({
  selector: 'app-add-foro',
  templateUrl: './add-foro.component.html',
  styleUrl: './add-foro.component.css'
})
export class AddForoComponent {
  constructor(
    public _matDialogRef: MatDialogRef<AddForoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private superadminservice: SuperadminService
  ) {
    this.inputTitulo = data?.titulo || null;
    this.inputContenido = data?.contenido || null;
    this.editar = data?.editar || false;
    this.id = data?.id || null;
  }

  // tomamos el id del usuario para la insercion
  usuario = 1;

  // tomamos el texto del input de titulo
  inputTitulo!: string;

  // tomamos el texto del input de contenido
  inputContenido!: string;

  // variable para saber si edita o guarda
  editar = false;

  // variable para guardar el id del foro
  id = 0;

  // metodo para emite un señal cuando se inserto un dato 
  @Output() datosInsertado = new EventEmitter<void>();

  // metodo para cerrar la ventana modal
  cerrar(): void {
    this._matDialogRef.close();
  }

  // funcion para tomar los datos y enviarlos al API 
  tomarDatos() {
    // Variable para guardar los parametros que vamos a meter en el envio
    const titulo        = this.inputTitulo; 
    const contenido     = this.inputContenido;
    
    console.log(this.usuario, titulo, contenido, this.id);
    console.log(this.editar);
    if (titulo == '' || titulo == '') {
      // Verificamos si hay que gurdar o editar con la variable siguiente
      if(this.editar == false){
        // Si es false guardara y hara lo siguiente
        this.superadminservice.guardarRegistroForo(this.usuario, titulo, contenido).subscribe(response => {
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
      }
    }  else {
      alert('Ingrese los textos antes de enviar')
    }
      
    // cerrar la venta modal
    this.cerrar();
  }
  
}
