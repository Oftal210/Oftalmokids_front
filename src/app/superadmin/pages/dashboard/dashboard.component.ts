import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import * as echarts from 'echarts';
import { SuperadminService } from '../../../servicios/superadmin.service';
import { Subject } from 'rxjs'; // Importar Subject
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';


interface ConsultData {
  period: string;
  consultations: number;
  newPatients: number;
}

interface Appointment {
  name: string;
  type: string;
  time: string;
  date: string;
}

interface Condition {
  name: string;
  patients: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  appointments: Appointment[] = [
    { name: 'N/A', type: 'N/A', time: 'Rango Edad', date: 'N/A' },
    { name: 'N/A', type: 'N/A', time: 'Rango Edad', date: 'N/A' },
    { name: 'N/A', type: 'N/A', time: 'Rango Edad', date: 'N/A' }
  ];

  conditions: Condition[] = [
    { name: 'Miopia', patients: 0 },
    { name: 'Astigmatismo', patients: 0 },
    { name: 'Hipermetropia', patients: 0 }
  ];

  stats = {
    parentsRegistered: { value: 0, increase: '20%' },
    childrenRegistered: { value: 0, increase: '15%' },
    consultationsThisMonth: { value: 0, increase: '25%' },
    
  };

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // variables para controlar el grafico
  private chart: any;

  // variable para guardar la data del grafico
  meses: any[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
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

    // llamamos las siguientes funciones para iniciar los datos en el dashboard
    this.buscarNumeroPadre();
    this.buscarNumeroPaciente();
    this.buscarMesesConsultas().then(() =>{
      this.initChart(); 
    });
    this.buscarDiagnosticos();
    this.buscarNumeroConsultas();
    this.buscarDiagnosticoEdad();
    window.addEventListener('resize', this.onResize);
  }

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
      grid: {
        width: "100%",
        left: '5%',  // Ajusta este valor para mover el gráfico más a la izquierda
        right: '5%',
        top: '10%',
        bottom: '10%'
      },
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
          type: 'bar',
          barWidth: "30%",
          itemStyle: {
            color: '#4CAF50' // Color de las barras
          }
        }
      ]
    };

    //option && myChart.setOption(option);
    this.chart.setOption(option);
  }

  // Función para redimensionar el gráfico cuando cambia el tamaño de la ventana
  onResize = () => {
    if (this.chart) {
      this.chart.resize();
    }
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    window.removeEventListener('resize', this.onResize);
  }

  // funcion para buscar el numero de padres registrados
  buscarNumeroPadre(): void { 
    this.superadminservice.obtenerPadres()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if(!data.mensaje){
          // modificamos el numero si no hay mensaje
          this.stats.parentsRegistered.value = data
        }
      });
  }

  // funcion para buscar el numero de hijos registrados
  buscarNumeroPaciente(): void {
    this.superadminservice.obtenerNumeroPacientes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if(!data.mensaje){
          // modificamos el numero si no hay mensaje
          this.stats.childrenRegistered.value = data
        }
      });
  }

  // Funcion para buscar el numero de padres y mostrarlo
  buscarMesesConsultas(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.superadminservice.obtenerConsultasxMeses()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: data => {
            if (!data.mensaje) {
              // modificamos el numero si no hay mensaje
              this.meses = data;
            }
            resolve();
          },
          error: err => {
            console.error(err);
            reject(err);
          }
        });
    });
  }

  buscarDiagnosticos(): void {
    this.superadminservice.obtenerDiagnosticosDashboard()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if(data.status == 200){
          this.conditions[0].patients = data.miopias
          this.conditions[1].patients = data.astigs
          this.conditions[2].patients = data.hiper
        }
      });
  }

  buscarNumeroConsultas(): void {
    this.superadminservice.obtenerNumeroMensualDiag()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if(data.status == 200){
          this.stats.consultationsThisMonth.value = data.mensual
        }
      });
  }

  buscarDiagnosticoEdad(): void {
    this.superadminservice.obtenerFrecuenciaDiagEdad()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        console.log(data.status)
        if(data.status == 200){
          console.log(data.diag[0]);
          for (let i = 0; i < data.diag.length; i++) {
            this.appointments[i].name = data.diag[i].codigo_diagnostico;
            this.appointments[i].type = data.diag[i].nombre_diagnostico;
            this.appointments[i].date = data.diag[i].edad_minima + ' a ' + data.diag[i].edad_maxima;
          }
        }
      });
  }
}
