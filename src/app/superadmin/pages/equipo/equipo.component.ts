import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';

// Componente para agregar pacientes, modal
import { AddAdminComponent } from '../add-admin/add-admin.component';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})

export class EquipoComponent {

  // variable para guardar los registros de los usuarios
  usuarios: any[] = [];

  // variable para tomar el dato del buscar
  inputDatoBusqueda!: string;

  // variable para saber la pagina actual
  p: number = 1;

  // variable para el numero de registros que se muetran a la vez
  cantreg: number = 8;

  // boton para verificar la visibilidad del boton
  botonVisible: boolean = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private _matDialog: MatDialog,
    private superadminservice: SuperadminService
  ) {}

  ngOnInit() {
    // llamamos a la funcion para traer los datos
    this.cargarRegistrosUsuarios();
  }

  abrirModal(): void {
    const dialogRef =this._matDialog.open(AddAdminComponent, {
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });

    dialogRef.componentInstance.datosInsertado.subscribe(() =>{
      this.cargarRegistrosUsuarios();
    })
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para traer a los usuarios
  cargarRegistrosUsuarios(): void {
    this.superadminservice.obtenerRegistroUsuario()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      console.log(data);
      this.usuarios = [];
      this.usuarios = data;
    })
  }

  // funcion para buscar el hijo en e input de busqueda 
  buscarRegistroUsuario(): void {
    this.superadminservice.buscarAdministrador(this.inputDatoBusqueda)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(data.status != 404){
        this.usuarios = [data.usuario];
        this.p = 1;
        this.botonVisible = true;
      } else {
        alert('No existe el paciente buscado');
        this.cargarRegistrosUsuarios();
        this.botonVisible = false;
      }
    })
  }

  ocultarBotonBusqueda(): void {
    this.botonVisible = false;
    this.cargarRegistrosUsuarios();
  }

  desactivarAdministrador(estado: string, docum: string): void{

    // variable del mensaje
    var mensaje: string = '';
    // validamos el estado para modificar el mensaje
    if(estado == 'activo') {
      mensaje = 'Activar';
    } else {
      mensaje = 'Desactivar';
    }

    // creamos la variable que realizara la pregunta y confirmacion
    const alertaDesactivar = window.confirm(`¿Desea ${mensaje} el usuario?`);

    // validamos si se confirmo la accion
    if (alertaDesactivar) {
      // llamamos al metodo para realizar la accion
      this.superadminservice.desactivarAdministrador(docum)
      .subscribe(
        data => {
          // mostramos alerta en base al resultado
          if (data.activado) {
            alert('Se Activo con Exito');
          } else {
            alert('Se Desactivo con Exito');
          }
        }, error => {
          console.error('Error al enviar los datos:', error);
          alert('Error en el sistema vuelva a intentarlo');
        });
    }
    
    setTimeout(() => {
      // llamamos a la funcion para cargar los datos nuevamente
      this.cargarRegistrosUsuarios();
    }, 1500);
    
  }

}
