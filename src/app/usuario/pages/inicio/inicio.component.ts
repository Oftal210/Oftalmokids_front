import { Component } from '@angular/core';
import { SuperadminService } from '../../../servicios/superadmin.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

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
          this.mostrarAlerta('', 'No Hay Publicaciones Aun', 'info');
        }
        resolve();
      });
    })
  }

  // funcion para las alertas del sistema
  mostrarAlerta(titulo: string ,mensaje: any, icono: any) {
    Swal.fire({
        title: titulo,
        icon: icono,
        text: mensaje,
        confirmButtonText: 'Aceptar',
        timer: 3000, // Duración en milisegundos (3 segundos)
        background: '#fff', // Color de fondo
        color: '#333', // Color del texto
        heightAuto: false,
        width: '450px',
        position: 'top',
        customClass: {
            popup: 'custom-popup'  // Aplica una clase personalizada para más ajustes (opcional)
        }
    });
  }
}
