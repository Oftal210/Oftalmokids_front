import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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

  // variable para tomar el dato del buscar
  inputDatoBusqueda!: string;

  // variable para saber la pagina actual
  p: number = 1;

  // variable para el numero de registros que se muetran a la vez
  cantreg: number = 4;

  // boton para verificar la visibilidad del boton
  botonVisible: boolean = false;

  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private _matDialog: MatDialog,
    private superadminservice: SuperadminService
  ) {}

  ngOnInit() {
    // llamamos a la funcion para traer los datos
    this.cargarRegistroHijos();
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
      this.hijos = data;
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
    
    this.superadminservice.buscarPaciente(this.inputDatoBusqueda)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(data.status != 404){
        this.hijos = [data.hijo];
        this.p = 1;
        this.botonVisible = true;
      } else {
        alert('No existe el paciente buscado');
        this.cargarRegistroHijos();
        this.botonVisible = false;
      }
    })
  }

  ocultarBotonBusqueda(): void{
    this.botonVisible = false;
    this.cargarRegistroHijos();
  }

}
