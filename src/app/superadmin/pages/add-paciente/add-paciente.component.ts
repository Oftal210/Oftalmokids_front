import { Component, Inject, Output, EventEmitter, DebugElement } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';
import { error } from 'node:console';

@Component({
  selector: 'app-add-paciente',
  templateUrl: './add-paciente.component.html',
  styleUrl: './add-paciente.component.css'
})
export class AddPacienteComponent {

  private unsubscribe$ = new Subject<void>();

  // varible para guardar lo que traiga la funcion especifica
  alerta!: string;

  // variable para validar si existe el padre
  existeDato = false;
  verificacioDato = false;

  // variable para guardar el input del documento del padre
  inputDocPadre!: string;

  // variables para guardar los otros datos del padre
  inputNomPadre!: string;
  inputApePadre!: string;
  inputTelePadre!: string;
  inputEmailPadre!: string;
  inputPasswPadre!: string;

  // variable para guardar el input del documento del hijo
  inputDocHijo!: string;

  // variables para guardar los otros datos del hijo
  inputTipDocHijo!: string;
  inputNomHijo!: string;
  inputApeHijo!: string;
  inputNacimHijo!: string;
  inputEdadHijo!: string;
  inputGeneroHijo!: string;
  documentoPadre!: string;
  
  constructor(
    private superadminservice: SuperadminService,
    public _matDialogRef: MatDialogRef<AddPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  // metodo para emite un señal cuando se inserto un dato 
  @Output() datosInsertado = new EventEmitter<void>();

  cerrar(): void {
    this._matDialogRef.close();
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para buscar a un paciente especifico
  buscarPaciente(hijo: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.superadminservice.buscarPaciente(hijo).subscribe(data => {
        if (data.status == 200){
          this.existeDato = true;
          alert('Ya se encuentra registrado')
        } else {
          this.existeDato = false;
          if(this.verificacioDato==false){
            alert('No se encuentra registrado el hijo');
          }
        }
        resolve(this.existeDato);
      }, error => {
        reject(error);
      }); 
    });
  }

  // funcion para buscar a un padre especifico
  buscarPadre(padre: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.superadminservice.buscarPadre(padre).subscribe(data => {
        if (data.status == 200){ 
          this.existeDato = true;
          this.documentoPadre = data.usuario.id;
          console.log(this.verificacioDato);
          if(this.verificacioDato==false){
            alert('Ya se encuentra registrado');
          }
        } else {
          this.existeDato = false;
          console.log(this.verificacioDato);
          if(this.verificacioDato==false){
            alert('No se encuentra registrado el padre');
          }
        }
        resolve(this.existeDato);
      }, error => {
        reject(error);
      });
    });
  }

  // funcion para insertar datos para paciente o para padre
  async tomarDatos() {
    
    // validamos que los datos del padre esten para insertar
    if (this.inputDocPadre && this.inputNomPadre && this.inputApePadre && this.inputTelePadre && this.inputEmailPadre && this.inputPasswPadre) {
      
      // cambiamos el valor para evitar la alerta innecesaria
      this.verificacioDato = true;
      
      // llamamos a la funcion para saber si esta registrado
      const padreExiste = await this.buscarPadre(this.inputDocPadre);
      
      // validamos que no exista para insertar
      if(this.verificacioDato){

        // realizamos la insercion de los datos
        this.superadminservice.guardarRegistroPadre(this.inputDocPadre, 2, this.inputNomPadre, this.inputApePadre, this.inputEmailPadre, this.inputTelePadre,  this.inputPasswPadre).pipe(takeUntil(this.unsubscribe$)).subscribe(response => {
          console.log('Respuesta del servidor:', response);
          // Emite el evento después de la inserción si fue exitosa
          this.datosInsertado.emit();
          console.log('SE INSERTO EL PADRE');
        }, error => {
          console.error('Error al enviar los datos:', error);
        });
      }

      // cambiamos el valor para evitar la alerta innecesaria
      this.verificacioDato = false;
    }
    
    // validamos que los datos del hijo esten para insertar
    if (this.inputDocHijo && this.inputTipDocHijo && this.inputNomHijo && this.inputApeHijo && this.inputNacimHijo && this.inputEdadHijo, this.inputGeneroHijo) {

      // cambiamos el valor para evitar la alerta innecesaria
      this.verificacioDato = true;

      // realizamos una busca para ver la existencia del padre
      const padreExiste = await this.buscarPadre(this.inputDocPadre);

      // validamos que exista para seguir
      if(padreExiste){
        // cambiamos el valor para evitar la alerta innecesaria
        this.verificacioDato = true;

        // realizamos una busca para ver la existencia del hijo
        const existeHijo = await this.buscarPaciente(this.inputDocHijo);

        // validamos que no exista para insertar
        if(!existeHijo){
          // realizamos la insercion de los datos
          this.superadminservice.guardarRegistroHijo(this.inputDocHijo, this.documentoPadre, this.inputNomHijo, this.inputApeHijo, this.inputTipDocHijo, this.inputNacimHijo).pipe(takeUntil(this.unsubscribe$)).subscribe(response => {
            console.log('Respuesta del servidor:', response);
            // Emite el evento después de la inserción si fue exitosa
            this.datosInsertado.emit();
            console.log('SE INSERTO EL HIJO');
          }, error => {
            console.error('Error al enviar los datos:', error);
          });
        }
      }

      // cambiamos el valor para evitar la alerta innecesaria
      this.verificacioDato = false;
    }
    this.cerrar();
  } 
}
