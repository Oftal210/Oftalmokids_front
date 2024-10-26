import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';

// Componente para agregar pacientes, modal
import { AddPacienteComponent } from '../add-paciente/add-paciente.component';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent {
  
  hijos: any[] = [];

  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private _matDialog: MatDialog,
    private superadminservice: SuperadminService
  ) {}

  ngOnInit() {
    // Ejemplo de datos que pueden venir de la base de datos
    //this.cargarRegistroHijos();
  }

  abrirModal(): void {
    this._matDialog.open(AddPacienteComponent, {
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para traer a los hijos 
  cargarRegistroHijos(): void {
    this.superadminservice.obtenerRegistroPaciente()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      console.log(data);
      this.hijos = data;
    });
  }
}
