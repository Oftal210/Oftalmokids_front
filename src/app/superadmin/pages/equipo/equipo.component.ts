import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // variable para saber la pagina actual
  p: number = 1;

  // variable para el numero de registros que se muetran a la vez
  cantreg: number = 4;

  // variables para buscar y guardar filtros de foro
  inputBusqueda: string = '';
  adminsFiltro: any[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private _matDialog: MatDialog,
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

    // llamamos a la funcion para traer los datos
    this.cargarRegistrosUsuarios();
  }

  // funcion para abrir la modal
  abrirModal(): void {
    const dialogRef =this._matDialog.open(AddAdminComponent, {
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });

    // en caso de que se haya añadido algo aqui se recibira un mensaje
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
      console.log(data)
      if (data.status == 200){
        this.usuarios = data.usuarios;
      } else {
        this.usuarios = [];
        alert(data.mensaje)
      }
      this.adminsFiltro = [...this.usuarios];
    });
  }

  // funcion para desactivar a un administrador
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

  // funcion para realizar filtro en los datos de los administradores
  filtraAdminsTitulo(): void {
    // tomamos el valor que haya en el input de busqueda
    const dato = this.inputBusqueda.toLowerCase();
    // realizamos el filtro y lo guardamos de la siguiente forma
    this.adminsFiltro = this.usuarios.filter(admin => {
      // Convertimos el estado activo/inactivo en texto
      const estado = admin.activo == 1 ? 'activados' : 'inactivo';
      console.log(estado);
      // Comprobamos si coincide con el dato buscado
      return (
        admin.nombre.toLowerCase().includes(dato) ||
        admin.apellido.toLowerCase().includes(dato) ||
        admin.telefono.toLowerCase().includes(dato) ||
        admin.email.toLowerCase().includes(dato) ||
        admin.documento.toLowerCase().includes(dato) ||
        estado.includes(dato) // Coincidencia con estado como texto
      );
    })
    console.log(this.adminsFiltro);
  }
}
