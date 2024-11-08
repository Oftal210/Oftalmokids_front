import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { PadreService } from '../../../servicios/padre.service';

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
  documentoHijo = 1; // Tomamos el id del hijo 
  yesAnswers: number = 0;
  totalQuestions: number = 6;
  gauge: any;
  finalValue: number = 0;
  temas: Tema[] = [
    { texto: 'Estas usando las gafas o lentes permanentes', calificado: false, respuesta: '', motivo: '' },
    { texto: 'Estas usando los medicamentos', calificado: false, respuesta: '', motivo: '' },
    { texto: 'Estas limitando el uso de pantallas', calificado: false, respuesta: '', motivo: '' },
    { texto: 'Estas realizando actividad al aire libre', calificado: false, respuesta: '', motivo: '' },
    { texto: 'Estas llevando buena alimentación', calificado: false, respuesta: '', motivo: '' },
    { texto: '¿Ya tienes que solicitar cita control?', calificado: false, respuesta: '', motivo: '' }
  ];

  constructor(private renderer: Renderer2, private el: ElementRef, private padreService: PadreService) {}

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
    this.gauge.maxValue = this.totalQuestions;
    this.gauge.setMinValue(0);
    this.gauge.animationSpeed = 32;
    this.gauge.set(0);
  }

  calificarTema(index: number, respuesta: 'like' | 'dislike'): void {
    const tema = this.temas[index];

    if (respuesta === 'like') {
      if (tema.respuesta !== 'like') {
        this.yesAnswers++;
      }
      tema.calificado = true;
      tema.respuesta = 'like';
      this.actualizarGauge();
    } else if (respuesta === 'dislike') {
      this.currentIndex = index;
      this.abrirModal(index);
    }
  }

  abrirModal(index: number): void {
    this.currentIndex = index;
    this.motivo = '';
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.currentIndex = -1;
  }

  guardarMotivo(): void {
    if (this.currentIndex !== -1) {
      const tema = this.temas[this.currentIndex];
      if (tema.respuesta === 'like') {
        this.yesAnswers--;
      }
      tema.calificado = true;
      tema.respuesta = 'dislike';
      tema.motivo = this.motivo;
      this.actualizarGauge();
    }
    this.cerrarModal();
  }

  actualizarGauge(): void {
    this.finalValue = Math.max(0, Math.min(this.yesAnswers, this.totalQuestions));
    this.gauge.set(this.finalValue);
  }

  tomarDatos() {
    const noCalificados = this.temas.some(t => !t.calificado);
    const faltanMotivos = this.temas.some(t => t.respuesta === 'dislike' && !t.motivo);

    if (noCalificados || faltanMotivos) {
      alert('Asegúrate de calificar todos los temas y proporcionar un motivo para los "dislike".');
      return;
    }

    const hijo = this.documentoHijo;
    const uso_gafas = this.temas[0].respuesta === 'like';
    const uso_medic = this.temas[1].respuesta === 'like';
    const limite_panta = this.temas[2].respuesta === 'like';
    const activ_libre = this.temas[3].respuesta === 'like';
    const buen_alimen = this.temas[4].respuesta === 'like';
    const solict_contr = this.temas[5].respuesta === 'like';
    const motivo_gafas = this.temas[0].motivo ?? null;
    const motivo_medic = this.temas[1].motivo ?? null;
    const motivo_panta = this.temas[2].motivo ?? null;
    const motivo_activ = this.temas[3].motivo ?? null;
    const motivo_buen = this.temas[4].motivo ?? null;
    const motivo_contr = this.temas[5].motivo ?? null;
    const punt_precon = this.finalValue;

    this.padreService.enviarPreconsulta(
      hijo, uso_gafas, uso_medic, limite_panta, activ_libre, buen_alimen, solict_contr, 
      punt_precon, motivo_gafas, motivo_medic, motivo_panta, motivo_activ, motivo_buen, motivo_contr
    ).subscribe(response => {
      console.log('Respuesta del servidor:', response);
      alert('los datos se insertaron correctamente');
    }, error => {
      console.error('Error al enviar los datos:', error);
    });
  }
}
