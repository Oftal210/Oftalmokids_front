import { Component } from '@angular/core';
import { SuperadminService } from '../../../servicios/superadmin.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  private unsubscribe$ = new Subject<void>();
  foros: any[] = [];
  
  constructor(private superadminservice: SuperadminService) {}
  ngOnInit() {
    // Ejemplo de datos que pueden venir de la base de datos
    this.cargarRegistrosforo();
  }


  // funcion para traer los registros del foro
  cargarRegistrosforo(): Promise<void> {
    // retornamos una promesa para usar al cargar los datos
    return new Promise((resolve) => {
      this.superadminservice.obtenerRegistrosForo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        //console.log(data);
        if (!data.mensaje) {
          this.foros = data;
        } else {
          alert('no hay datos');
        }
        resolve();
      });
    })
  }
}
