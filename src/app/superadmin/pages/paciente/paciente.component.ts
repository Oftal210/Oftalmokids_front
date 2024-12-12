import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';

// Componente para agregar pacientes, modal
import { AddPacienteComponent } from '../add-paciente/add-paciente.component';


@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent implements OnInit {
  
  // variable para guardar los registros de los hijos
  hijos: any[] = [];
  controles: any[] = [];

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // variable para saber la pagina actual
  p: number = 1;

  // variable para el numero de registros que se muetran a la vez
  cantreg: number = 4;

  // variables para buscar y guardar filtros de foro
  inputBusqueda: string = '';
  pacientesFiltro: any[] = [];

  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private _matDialog: MatDialog,
    private superadminservice: SuperadminService,
    private router: Router
  ) {}

  ngOnInit() {
    // verificamos el rol para sacarlo al login
    if (this.documentoAdministrador) {
      var docAdministrador = JSON.parse(this.documentoAdministrador);
      if(docAdministrador.id_rol != 1){
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }

    // llamamos a la funcion para traer los datos
    this.cargarRegistroHijos();
    this.cargarControlesHijos();
  }

  abrirModal(): void {
    const dialogRef = this._matDialog.open(AddPacienteComponent, {
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
    this.superadminservice.obtenerRegistroPaciente()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      // validamos que no venga un mensaje con el error
      //console.log(data)
      if(data.status == 200) {
        this.hijos = data.hijo;
      } else {
        this.hijos = [];
        this.mostrarAlerta('', data.mensaje, 'warning');
      }
      // clonamos los datos dentro de la siguiente variable
      this.pacientesFiltro = [...this.hijos];
    });
  }

  // funcion para traer a los hijos 
  cargarControlesHijos(): void {
    this.superadminservice.obtenerControlesPaciente()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      // validamos que no venga un mensaje con el error
      //console.log(data)
      if(data.status == 200) {
        this.controles = data.datos;
        this.controles = this.pacientesFiltro.map(hijo => {
          // Buscar el control correspondiente de v1
          const control = this.controles.find(item => item.id_hijo === hijo.id)?.control;
          // Si hay un control encontrado, lo añadimos al objeto hijo
          if (control) {
            hijo.control = control;
          }
          return hijo;
        });
      } else {
        this.controles = [];
      }
    });
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

  // funcion para realizar filtro en los datos de los pacientes
  filtraPacientesTitulo(): void {
    // tomamos el valor que haya en el input de busqueda
    const dato = this.inputBusqueda.toLowerCase();
    // realizamos el filtro y lo guardamos de la siguiente forma
    this.pacientesFiltro = this.hijos.filter(
      paciente =>
        paciente.nombre.toLowerCase().includes(dato) ||         // buscamos por nombre, apellido, documento
        paciente.apellido.toLowerCase().includes(dato) ||       // fecha de nacimiento y tipo de documento
        paciente.tipo_documento.toLowerCase().includes(dato) ||
        paciente.documento.toLowerCase().includes(dato) ||
        paciente.fecha_nacimiento.toLowerCase().includes(dato)
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

}
