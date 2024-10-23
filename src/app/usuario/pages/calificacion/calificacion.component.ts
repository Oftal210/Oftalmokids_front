import { Component, AfterViewInit } from '@angular/core';
import { Gauge } from 'gaugeJS';

@Component({
    selector: 'app-calificacion',
    templateUrl: './calificacion.component.html',
    styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements AfterViewInit {
  ngAfterViewInit(): void {
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
        { strokeStyle: "#F03E3E", min: 0, max: 33 },
        { strokeStyle: "#FFDD00", min: 33, max: 66 },
        { strokeStyle: "#30B32D", min: 66, max: 100 }
      ]
    };
    const target = document.getElementById('gaugeChart') as HTMLCanvasElement;
    const gauge = new Gauge(target).setOptions(opts);
    
  }
}
