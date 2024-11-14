import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';
import { NoopAnimationPlayer } from '@angular/animations';

declare var Gauge: any;

@Component({
  selector: 'app-monitoreo-semanal',
  templateUrl: './monitoreo-semanal.component.html',
  styleUrl: './monitoreo-semanal.component.css'
})
export class MonitoreoSemanalComponent implements AfterViewInit {

  // variable para guardar los registros de los usuarios
  preconsultas: any[] = [];
  promedioPrecon: number = 0;

  visibilidad: boolean[] = [];
  
  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');
  
  // documento del paciente
  idhijo: string | null = null;

  gauge: any;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private superadminservice: SuperadminService,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    // verificamos el rol para sacarlo al login
    if (this.documentoAdministrador) {
      var docAdministrador = JSON.parse(this.documentoAdministrador);
      if(docAdministrador.id_rol != 1){
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }

    this.idhijo = this.route.snapshot.paramMap.get('id');
    // Cargar el usuario con el ID obtenido
    console.log(this.idhijo);
    // llamamos a la funcion para traer los datos
    this.cargarRegistrosPreconsulta();
    this.cargarPromedioPreconsulta();
    const script = this.renderer.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gaugeJS/dist/gauge.min.js';
    script.onload = () => {
      this.initializeGauge();
    };
    this.renderer.appendChild(document.body, script);
    this.visibilidad = Array(this.preconsultas.length).fill(false);
  }

  // Método para alternar la visibilidad de un índice específico
  toggleVisibility(index: number): void {
    this.visibilidad[index] = !this.visibilidad[index];
  }

  // Método que verifica si un índice específico es visible
  isVisible(index: number): boolean {
    return !!this.visibilidad[index];
  }

  initializeGauge(): void {
    const opts = {
      angle: 0.0,
      lineWidth: 0.2,
      radiusScale: 1.0,
      pointer: {
        length: 0.6,
        strokeWidth: 0.04,
        color: '#000000'
      },
      limitMax: false,
      limitMin: false,
      colorStart: '#6FADCF',
      colorStop: '#8FC0DA',
      strokeColor: '#E0E0E0',
      generateGradient: true,
      highDpiSupport: true,
      staticZones: [
        { strokeStyle: "#F03E3E", min: 0, max: 2 },
        { strokeStyle: "#FFDD00", min: 2, max: 4 },
        { strokeStyle: "#30B32D", min: 4, max: 6 }
      ]
    };
    const target = this.el.nativeElement.querySelector('#gaugeChart') as HTMLCanvasElement;
    this.gauge = new Gauge(target).setOptions(opts);
    this.gauge.maxValue = 6; // Valor máximo ajustado a 6
    this.gauge.setMinValue(0); // Valor mínimo ajustado a 0
    this.gauge.animationSpeed = 32;

    console.log(this.promedioPrecon)

    if (this.promedioPrecon != null) {
      console.log('tiene algo');
      this.gauge.set(this.promedioPrecon);
    } else {
      console.log('vacio o nulo');
    }

    //this.gauge.set( this.promedioPrecon ); // Inicializa el medidor en 0
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para traer los registros de preconsultas de este mes
  cargarRegistrosPreconsulta(): void {
    this.superadminservice.buscarPreconsultasHijo(this.idhijo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      console.log(data);
      if (!data.status){
        this.preconsultas = data;
      } else {
        this.preconsultas = [];
        alert('Este Paciente no tiene Preconsultas Aun.')
      }
    })
  }

  // funcion para procesar si la preconsulta tiene mensaje adicional
  procesarResultadoPrecon(boleano: number, texto: string): string {
    // declaramos la variable
    let mensaje = '';

    // validamos si es 1 o 0
    if (boleano == 1) {
      mensaje = 'Si';     
    } else {
      mensaje = 'No'  // si es 0 hacemos
      if (texto != null){             // verificamos si no es null
        mensaje += ', ' + texto;      // añadimos una ',' y el texto  
      }
    }
    
    return mensaje;
  }

  // funcion para traer el promedio del puntaje de las preconsultas de este mes
  cargarPromedioPreconsulta(): void {
    this.superadminservice.buscarPromedioPreconsultasHijo(this.idhijo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      console.log(data);
      this.promedioPrecon = data;
      this.initializeGauge();
    })
  }
  

}
