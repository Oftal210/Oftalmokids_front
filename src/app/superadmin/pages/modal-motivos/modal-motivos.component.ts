import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { storage } from 'firebase-admin';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay'; import { MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/datepicker';


@Component({
  selector: 'app-modal-motivos',
  templateUrl: './modal-motivos.component.html',
  styleUrl: './modal-motivos.component.css',
})
export class ModalMotivosComponent {

  // variable para el datapicker
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // variable para guardar el motivo
  motivoTexto: string = '';

  // variable para verificar si es filtro
  activarCalendario: boolean = false;

  // variable para el titulo de la moda
  tituloModal: string = 'Razón de la respuesta';

  // variables para las fechas
  fechaU: string = '';
  fechaD: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialogRef: MatDialogRef<ModalMotivosComponent>
  ){
    console.log(data);
    this.motivoTexto = data.motivo;
    this.activarCalendario = data.filtro;
    if(this.activarCalendario){
      this.tituloModal = 'Seleccione un rango de fechas'
    }    
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  enviarFechasFiltro() {
    const fechau = new Date(this.fechaU); 
    const fechad = new Date(this.fechaD);
    var resultado = {};
    if (fechau < fechad) { 
      resultado = {fechaInicio: this.fechaU, fechaFin: this.fechaD};
    } else { 
      resultado = {fechaInicio: this.fechaD, fechaFin: this.fechaU};
    }
    this.dialogRef.close(resultado);
  }

}
