import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PadreService } from '../../../servicios/padre.service';

import { AddHijoComponent } from '../add-hijo/add-hijo.component';

@Component({
  selector: 'app-list-hijo',
  templateUrl: './list-hijo.component.html',
  styleUrl: './list-hijo.component.css'
})
export class ListHijoComponent {

  // variable para guardar los registros de los hijos
  hijos: any[] = [];

  // variable para tomar el dato del buscar
  inputDatoBusqueda!: string;

  // variable para saber la pagina actual
  p: number = 1;

  // variable para el numero de registros que se muetran a la vez
  cantreg: number = 4;

  // boton para verificar la visibilidad del boton
  botonVisible: boolean = false;

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  private unsubscribe$ = new Subject<void>();

  constructor(
    private _matDialog: MatDialog,
    private padreservice: PadreService
  ) {}

  ngOnInit() {
    // llamamos a la funcion para traer los datos
    this.cargarRegistroHijos();
  }

  abrirModal(): void {
    const dialogRef = this._matDialog.open(AddHijoComponent, {
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });

    dialogRef.componentInstance.datosInsertado.subscribe(() =>{
      this.cargarRegistroHijos();
    });
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para traer a los hijos 
  cargarRegistroHijos(): void {
    if (this.documentoAdministrador) {
      var docAdministrador = JSON.parse(this.documentoAdministrador);
    }

    this.padreservice.obtenerHijosPadre(docAdministrador.documento)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.hijos = data;
      console.log(data);
    })
  }

  // funcion para calcular la edad del paciente
  calcularEdadPaciente(fecha_nacimiento: string): number {
    
    // tomamos la fecha actual
    const fechaActual = new Date();

    // convertimos la fecha a tipo date
    const fechaNacimiento = new Date(fecha_nacimiento);

    // realizamos el calculo de la edad
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

    // realizamos el calculo de meses hasta la fecha de nacimeiento
    const mes = fechaActual.getMonth() - fechaNacimiento.getMonth();
    
    // verificamos si faltan meses para la fecha de nacimiento
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())){
      edad--; // en caso de que falte se le restara
    }
    // retornamos la edad en el lugar de llamada
    return edad;
  }

  // funcion para buscar el hijo en e input de busqueda 
  buscarRegistroHijo(): void {
    
    this.padreservice.buscarPaciente(this.inputDatoBusqueda)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(data.status != 404){
        this.hijos = [data.hijo];
        this.p = 1;
        this.botonVisible = true;
      } else {
        alert('No existe el hijo buscado');
        this.cargarRegistroHijos();
        this.botonVisible = false;
      }
    });
  }

  ocultarBotonBusqueda(): void{
    this.botonVisible = false;
    this.cargarRegistroHijos();
  }

  // funcion para editar el foro
  editarHijoModal(hijo: any): void {
    console.log(hijo)
    // Variable para abrir la ventana modal y enviarle los datos del 
    const dialogRef = this._matDialog.open(AddHijoComponent, {
      data: {
        id: hijo.id,
        tipodocumento: hijo.tipo_documento,
        documento: hijo.documento,
        nombre: hijo.nombre,
        apellido: hijo.apellido,
        fechanacimiento: hijo.fecha_nacimiento,
        edad: hijo.edad, 
        genero: hijo.genero,
        direccion: hijo.direccion,
        editar: true,
      }
    });

    // al insertar correctamente, se avisa por este medio para realizar una actualizacion de los datos
    // dialogRef.componentInstance.datosInsertado.subscribe(() =>{

    // })
  }


}
