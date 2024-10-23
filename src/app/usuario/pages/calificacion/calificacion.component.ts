import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';

declare var Gauge: any;

interface Tema {
  texto: string;
  calificado: boolean;
  respuesta: string;
}

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements AfterViewInit {
  yesAnswers: number = 0;
  totalQuestions: number = 6;
  gauge: any;
  finalValue: number = 0;
  temas: Tema[] = [
    { texto: 'Estas usando las gafas o lentes permanentes', calificado: false, respuesta: '' },
    { texto: 'Estas usando los medicamentos', calificado: false, respuesta: '' },
    { texto: 'Estas limitando el uso de pantallas', calificado: false, respuesta: '' },
    { texto: 'Estas realizando actividad al aire libre', calificado: false, respuesta: '' },
    { texto: 'Estas llevando buena alimentación', calificado: false, respuesta: '' },
    { texto: 'Ya tienes que solicitar cita control?', calificado: false, respuesta: '' }
  ];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

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

  calificarTema(index: number, respuesta: 'like' | 'dislike'): void {
    const tema = this.temas[index];
    if (tema.calificado && tema.respuesta === respuesta) {
      // Si ya está calificado con la misma respuesta, no hacer nada
      return;
    }

    // Actualizar la cuenta de respuestas "sí"
    if (tema.respuesta === 'like') {
      this.yesAnswers--;
    }

    // Actualizar con la nueva respuesta
    tema.calificado = true;
    tema.respuesta = respuesta;

    if (respuesta === 'like') {
      this.yesAnswers++;
    }

    this.finalValue = this.yesAnswers; // Guarda el valor final
    this.gauge.set(this.finalValue); // Asegurarse de que el valor final esté dentro del rango 0-6 
  }

  tomarDatos() {
    this.temas.forEach((tema) => {
      console.log(`${tema.respuesta}`);
    });

    console.log(this.temas[0].respuesta);
  }

}