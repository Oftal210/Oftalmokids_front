import { Component, OnInit, HostListener } from '@angular/core';
import * as echarts from 'echarts';
import { SuperadminService } from '../../../servicios/superadmin.service';
import { Subject } from 'rxjs'; // Importar Subject
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  // variable para guardar los hijos de la consulta
  hijos = 0;

  // variable para guardar los padres de la consulta
  padres = 0;

  // variable para guardar  los datos de los meses
  meses: any[] = [];

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // variable para manejar el grafico
  private chart: any;
  
  // variable para manejar la carga de la conuslta
  private unsubscribe$ = new Subject<void>();

  constructor(
    private superadminservice: SuperadminService,
    private router: Router
  ) {}

  // funciones que se inician al cargar el documento 
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

    this.cargarNumeroPadres();  // llama la funcion de los padres
    this.cargarNumeroHijos();   // llama la funcion de los hijos
    this.cargarMeses();         // llama la funcion de los hijos
  }

  // funcion para cargar y hacer el grafico
  initChart(): void {
    
    const chartDom = document.getElementById('main')!;
    //const myChart = echarts.init(chartDom);
    this.chart = echarts.init(chartDom);

    // Asumiendo que `this.meses` ya tiene los datos
    const meses = this.meses;

    // Extraemos las claves (meses) y los valores
    const labels = Object.keys(meses);  // ["enero_febrero", "marzo_abril", ...]
    const dataValues = Object.values(meses);  // [1, 1, 1, 1, 1, 1]

    const option = {
      xAxis: {
        type: 'category',
        data: labels,
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: dataValues,
          type: 'bar'
        }
      ]
    };

    //option && myChart.setOption(option);
    this.chart.setOption(option);
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  // Funcion para buscar cuantos registros hay que hijos
  cargarNumeroHijos(): void {
    this.superadminservice.obtenerNumeroPacientes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if (!data.mensaje) {
          this.hijos = data;
        } else {
          alert('no hay pacientes');
        }
      });
  }

  // Funcion para buscar el numero de padres y mostrarlo
  cargarNumeroPadres(): void {
    this.superadminservice.obtenerPadres()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe( data => {
        this.padres = data;
    })
  }

  // Funcion para buscar el numero de padres y mostrarlo
  cargarMeses(): void {
    this.superadminservice.obtenerConsultasxMeses()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe( data => {
        this.meses = data;
        this.initChart();
    })
  }

  // funcion que escucha cada que se modifica el tamaño de la pantalla, resposive
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.chart) {
      this.chart.resize(); // Ajustar el gráfico cuando se redimensiona la ventana
    }
  }
}
