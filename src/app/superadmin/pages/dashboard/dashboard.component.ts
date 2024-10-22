import { Component, OnInit, HostListener } from '@angular/core';
import * as echarts from 'echarts';
import { DashboardService } from '../../../servicios/dashboard.service';
import { Subject } from 'rxjs'; // Importar Subject
import { takeUntil } from 'rxjs/operators';

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

  // variable para manejar el grafico
  private chart: any;
  
  // variable para manejar la carga de la conuslta
  private unsubscribe$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  // funciones que se inician al cargar el documento 
  ngOnInit(): void {
    this.initChart();           // si este no se ejecuta primero, la pagina no carga
    this.cargarNumeroHijos();   // llama la funcion de los hijos
    this.cargarNumeroPadres();  // llama la funcion de los padres
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
    this.dashboardService.obtenerPacientes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.hijos = data;
      });
  }

  // Funcion para buscar el numero de padres y mostrarlo
  cargarNumeroPadres(): void {
    this.dashboardService.obtenerPadres()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe( data => {
        this.padres = data;
    })
  }

  // Funcion para buscar el numero de padres y mostrarlo
  cargarMeses(): void {
    this.dashboardService.obtenerConsultasxMeses()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe( data => {
        this.meses = data;
        this.initChart() 
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
