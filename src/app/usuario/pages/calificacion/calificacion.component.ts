import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { DashboardService } from '../../../servicios/dashboard.service';

declare var Gauge: any;

interface Tema {
  texto: string;
  calificado: boolean;
  respuesta: string;
  motivo?: string;
}

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements AfterViewInit {
  
  isModalOpen: boolean = false;
  currentIndex: number = -1;
  motivo: string = '';
  documentoHijo = 3; // Tomamos el id del hijo 
  yesAnswers: number = 0;
  totalQuestions: number = 6;
  gauge: any;
  finalValue: number = 0;
  temas: Tema[] = [
    { texto: 'Estas usando las gafas o lentes permanentes', calificado: false, respuesta: '', motivo:''},
    { texto: 'Estas usando los medicamentos', calificado: false, respuesta: '', motivo:''},
    { texto: 'Estas limitando el uso de pantallas', calificado: false, respuesta: '', motivo:''},
    { texto: 'Estas realizando actividad al aire libre', calificado: false, respuesta: '', motivo:''},
    { texto: 'Estas llevando buena alimentación', calificado: false, respuesta: '', motivo:''},
    { texto: 'Ya tienes que solicitar cita control?', calificado: false, respuesta: '' , motivo:''}
  ];

  constructor(private renderer: Renderer2, private el: ElementRef, private dashboardService: DashboardService) {}

  ngAfterViewInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gaugeJS/dist/gauge.min.js';
    script.onload = () => {
      this.initializeGauge();
    };
    this.renderer.appendChild(document.body, script);
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
    this.gauge.set(0); // Inicializa el medidor en 0
  }

  // calificarTema(index: number, respuesta: 'like' | 'dislike'): void {
  //   const tema = this.temas[index];
  //   if (tema.calificado && tema.respuesta === respuesta) {
  //     // Si ya está calificado con la misma respuesta, no hacer nada
  //     return;
  //   }

  //   // Actualizar la cuenta de respuestas "sí"
  //   if (tema.respuesta === 'like') {
  //     this.yesAnswers--;
  //   }

  //   // Actualizar con la nueva respuesta
  //   tema.calificado = true;
  //   tema.respuesta = respuesta;

  //   if (respuesta === 'like') {
  //     this.yesAnswers++;
  //   }

  //   this.finalValue = this.yesAnswers; // Guarda el valor final
  //   this.gauge.set(this.finalValue); // Asegurarse de que el valor final esté dentro del rango 0-6 
  // }

  calificarTema(index: number, respuesta: 'like' | 'dislike'): void {
    const tema = this.temas[index];
    if (tema.calificado && tema.respuesta === respuesta) {
      // Si ya está calificado con la misma respuesta, no hacer nada
      return;
    }

    if (respuesta === 'like') {
      tema.calificado = true;
      tema.respuesta = respuesta;
      this.updateGauge('like');
    } else if (respuesta === 'dislike') {
      this.abrirModal(index);
    }
  }

  abrirModal(index: number): void {
    this.currentIndex = index;
    this.motivo = ''; // Limpiar el motivo anterior
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  guardarMotivo(): void {
    if (this.currentIndex !== -1) {
      this.temas[this.currentIndex].calificado = true;
      this.temas[this.currentIndex].respuesta = 'dislike';
      this.temas[this.currentIndex].motivo = this.motivo;
      this.updateGauge('dislike');
      this.cerrarModal();
    }
  }

  updateGauge(type: 'like' | 'dislike'): void {
    if (type === 'like') {
      this.yesAnswers++;
    } else if (type === 'dislike' && this.yesAnswers > 0) {
      this.yesAnswers--;
    }

    this.finalValue = this.yesAnswers;
    this.gauge.set(this.finalValue); // Asegurarse de que el valor final esté dentro del rango 0-6
  }

  tomarDatos() {
    // Variable para guardar los parametros que vamos a meter en el envio 
    const hijo          = this.documentoHijo; 
    const uso_gafas     = this.temas[0].respuesta === 'like' ? true : false;
    const uso_medic     = this.temas[1].respuesta === 'like' ? true : false; 
    const limite_panta  = this.temas[2].respuesta === 'like' ? true : false; 
    const activ_libre   = this.temas[3].respuesta === 'like' ? true : false; 
    const buen_alimen   = this.temas[4].respuesta === 'like' ? true : false; 
    const solict_contr  = this.temas[5].respuesta === 'like' ? true : false;
    const motivo_gafas  = this.temas[0]?.motivo ?? null;
    const motivo_medic  = this.temas[1]?.motivo ?? null;
    const motivo_panta  = this.temas[2]?.motivo ?? null;
    const motivo_activ  = this.temas[3]?.motivo ?? null;
    const motivo_buen   = this.temas[4]?.motivo ?? null;
    const motivo_contr  = this.temas[5]?.motivo ?? null;
    const punt_precon   = this.finalValue;
  
    console.log(hijo, uso_gafas, uso_medic, limite_panta, activ_libre, buen_alimen, solict_contr, punt_precon, motivo_gafas, motivo_medic, motivo_panta, motivo_activ, motivo_buen, motivo_contr);

    //Enviamos los datos convertidos 
    this.dashboardService.enviarPreconsulta(hijo, uso_gafas, uso_medic, limite_panta, activ_libre, buen_alimen, solict_contr, punt_precon, motivo_gafas, motivo_medic,motivo_panta, motivo_activ, motivo_buen, motivo_contr).subscribe(response => {
      console.log('Respuesta del servidor:', response);
    }, error => {
      console.error('Error al enviar los datos:', error);
    });
  }
}