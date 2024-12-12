import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

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
  controles: any[] = [];

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
  documentoPadre!: string;

  // variables para buscar y guardar filtros de hijo
  inputBusqueda: string = '';
  hijosFiltro: any[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private _matDialog: MatDialog,
    private padreservice: PadreService
  ) {}

  ngOnInit() {
    if (this.documentoAdministrador) {
      this.documentoPadre = JSON.parse(this.documentoAdministrador).documento;
    }
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
    this.padreservice.obtenerHijosPadre(this.documentoPadre)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(data.status != 404) {
        this.hijos = data;
      } else{
        this.mostrarAlerta('', data.mensaje, 'info');
        this.hijos = [];
      }
      this.hijosFiltro = [...this.hijos];
      this.cargarTiempoControl();
    })
  }

  // funcion para traer la fecha del control mas reciente de los pacientes
  cargarTiempoControl(): void {
    this.padreservice.obtenerTiempoControl(this.documentoPadre)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      //console.log(data)
      if(data.status == 200 ) {
        // this.hijos = data;
        this.controles = data.datos;
        this.hijos = this.hijos.map(hijo => {
          // Buscar el control correspondiente de v1
          const control = this.controles.find(item => item.id_hijo === hijo.id)?.control;
          // Si hay un control encontrado, lo añadimos al objeto hijo
          if (control) {
            hijo.control = control;
          }
          return hijo;
        });
      } else{
        this.mostrarAlerta('', data.mensaje, 'error');
        this.hijos = [];
      }
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

  ocultarBotonBusqueda(): void{
    this.botonVisible = false;
    this.cargarRegistroHijos();
  }

  // funcion para editar el foro
  editarHijoModal(hijo: any): void {
    //console.log(hijo)
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
    dialogRef.componentInstance.datosInsertado.subscribe(() =>{

      // llamamos a la funcion que trae los registros de foro
      this.cargarRegistroHijos();
    });
  }

  // funcion para realizar filtro en los datos de los hijos
  filtraHijosTitulo(): void {
    // tomamos el valor que haya en el input de busqueda
    const dato = this.inputBusqueda.toLowerCase();
    // realizamos el filtro y lo guardamos de la siguiente forma
    this.hijosFiltro = this.hijos.filter(
      hijo =>
        hijo.nombre.toLowerCase().includes(dato) ||         // buscamos por nombre, apellido, documento
        hijo.apellido.toLowerCase().includes(dato) ||       // fecha de nacimiento y tipo de documento
        hijo.tipo_documento.toLowerCase().includes(dato) ||
        hijo.documento.toLowerCase().includes(dato) ||
        hijo.fecha_nacimiento.toLowerCase().includes(dato)
    );
  }

  // funcion para darle un formato a la fecha
  formatDate(dateString: string): string {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const date = new Date(dateString);
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
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

  abrirWhatsApp() {
    const telefono = '573136923982'; // Número de teléfono en formato internacional sin símbolos ni espacios
    const url = `https://wa.me/${telefono}`;
    
    window.open(url, '_blank'); // Abre el enlace en una nueva pestaña
  }
}
