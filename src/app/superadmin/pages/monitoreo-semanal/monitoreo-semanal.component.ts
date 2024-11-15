import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';
import { NoopAnimationPlayer } from '@angular/animations';


@Component({
  selector: 'app-monitoreo-semanal',
  templateUrl: './monitoreo-semanal.component.html',
  styleUrl: './monitoreo-semanal.component.css'
})
export class MonitoreoSemanalComponent {

  // variable para guardar los registros de los usuarios
  preconsultas: any[] = [];
  preconsultasFiltradas: any[] = [];

  // variable para guardar datos del hijo
  hijo = {
    nombre:    'N/A',
    apellido:  'N/A',
    documento: 'N/A',
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

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');
  
  // documento del paciente tomado de la URL
  documentohijo: string | null = null;

  private unsubscribe$ = new Subject<void>();

  constructor(
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
      if(data.hijo){
        this.hijo = {
          nombre:     data.hijo.nombre,
          apellido:   data.hijo.apellido,
          documento:  data.hijo.documento
        }
      } else {
        alert(data.mensaje);
      }
    })
  }

  // funcion para traer los registros de preconsultas de este mes
  cargarRegistrosPreconsulta(): void {
    this.superadminservice.buscarPreconsultasHijo(this.documentohijo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if (data.status != 200){
        // rellenamos la variable con los datos traidos
        this.preconsultas = data;

        // buscamos la fecha mas reciente de la ultima preconsulta
        const objetoMasReciente = this.preconsultas.reduce((a, b) => new Date(a.fecha_preconsulta) > new Date(b.fecha_preconsulta) ? a : b);
        // tomamos el dato y lo agregamos para mostrarlo
        this.ultimaConsulta = objetoMasReciente.fecha_preconsulta.split(' ')[0];
      } else {
        // mensaje con el fallo que se encontro
        alert(data.mensaje);
        // vaciamos la variable de preconsulta
        this.preconsultas = [];
      }
    })
  }

  // funcion para traer el promedio del puntaje de las preconsultas de este mes
  cargarPromedioPreconsulta(): void {
    this.superadminservice.buscarPromedioPreconsultasHijo(this.documentohijo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if (data.status != 200){
        console.log('hay un')
      }
      console.log(data);
      //this.promedioPrecon = data;
    })
  }
  

}
