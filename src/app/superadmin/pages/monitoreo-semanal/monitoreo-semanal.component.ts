import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// componente de la modal
import { ModalMotivosComponent } from '../modal-motivos/modal-motivos.component';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';
import { NoopAnimationPlayer } from '@angular/animations';
import { DateAdapter } from '@angular/material/core';
import { MousePointerBanIcon } from 'lucide-angular';


@Component({
  selector: 'app-monitoreo-semanal',
  templateUrl: './monitoreo-semanal.component.html',
  styleUrl: './monitoreo-semanal.component.css'
})
export class MonitoreoSemanalComponent {

  // variable para guardar los registros de los usuarios
  preconsultas: any[] = [];
  preconsultasFiltradas: any[] = [];

  // variable para guardar datos del hijo y de las consultas
  hijo = {
    nombre:    'N/A',
    apellido:  'N/A',
    documento: 'N/A',
    foto:      '../../../../assets/images/pollito.png',
  }
  preguntasConsulta = {
    lentes:       '¿Esta usando las gafas o lentes permanentes?',
    medicamento:  '¿Esta usando los medicamentos?',
    pantalla:     '¿Esta limitando el uso de pantallas?',
    aireLibre:    '¿Esta realizando actividad al aire libre?',
    alimentacion: '¿Esta llevando buena alimentación?',
    citaControl:  '¿Ya tienes que solicitar cita control?',
  }

  // variable para guardar la fecha de la ultima consulta
  ultimaConsulta: string = 'N/A';

  // variable para guardar el dato para el porcentaje de la barra
  barraProgreso: number = 0;

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');
  
  // documento del paciente tomado de la URL
  documentohijo: string | null = null;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private _matDialog: MatDialog,
    private superadminservice: SuperadminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // verificamos el rol para sacarlo al login
    if (this.documentoAdministrador) {
      var docAdministrador = JSON.parse(this.documentoAdministrador);
      if(docAdministrador.id_rol != 1){
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }

    // tomamos un documento de la URL para usarlo despues
    this.documentohijo = this.route.snapshot.paramMap.get('id');
    
    // llamamos a la funcion para traer los datos
    this.cargarRegistroPaciente();
    this.cargarRegistrosPreconsulta();
    this.cargarPromedioPreconsulta();
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para traer los datos del hijo
  cargarRegistroPaciente(): void {
    this.superadminservice.buscarPaciente(this.documentohijo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      console.log(data)
      if(data.hijo){
        this.hijo = {
          nombre:     data.hijo.nombre,
          apellido:   data.hijo.apellido,
          documento:  data.hijo.documento,
          foto: data.hijo.foto && data.hijo.foto !== '' 
          ? 'http://127.0.0.1:8000/storage/' + data.hijo.foto 
          : this.hijo.foto
        }
        console.log(this.hijo.foto);
      } else {
        alert(data.mensaje);
      }
    })
  }

  // funcion para traer los registros de preconsultas de este mes
  cargarRegistrosPreconsulta(): void {
    this.superadminservice.buscarPreconsultaReciente(this.documentohijo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if (data.status != 200){
        // mensaje con el fallo que se encontro
        alert(data.mensaje);
        // vaciamos la variable de preconsulta
        this.preconsultas = [];
      } else {

        // tomamos el registro mas reciente que nos retorna
        this.preconsultas = [data.consultas];

        // tomamos el dato y lo agregamos para mostrarlo
        this.ultimaConsulta = data.consultas.fecha_preconsulta.split(' ')[0];
      }
    })
  }

  cargarRegistrosFechas(fechaInicio: any, fechaFin: any): void {
    this.superadminservice.buscarPreconsultasHijoFechas(this.documentohijo, fechaInicio, fechaFin)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      console.log(data)
      if (data.status != 200){
        alert(data.mensaje);
        this.cargarRegistrosPreconsulta();
      } else {
        this.preconsultas = data.consultas;
      }
    })
  }

  // funcion para traer el promedio del puntaje de las preconsultas de este mes
  cargarPromedioPreconsulta(): void {
    this.superadminservice.buscarPromedioPreconsultasHijo(this.documentohijo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if (data.status != 200){
        alert(data.mensaje)
      } else {
        this.barraProgreso = data.promedio*100/6;
      }
    })
  }

  // funcion para enviarle datos a la modal
  abrirModal (motivo: string, filtro: boolean) {
    const dialogRef = this._matDialog.open(ModalMotivosComponent, {
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        motivo,
        filtro
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result.fechaInicio != '' || result.fechaFin != ''){
        this.cargarRegistrosFechas(result.fechaInicio, result.fechaFin);
      } else {
        alert('no selecciono fechas para filtrar');
      }
    });
  }

}
