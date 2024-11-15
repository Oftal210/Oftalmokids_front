import { Component, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

// Metodos y funciones con ventanas modales
import { MatDialog } from '@angular/material/dialog';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';

// Componenete para la ventana modal del foro
import { AddForoComponent } from '../add-foro/add-foro.component';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrl: './foro.component.css'
})

export class ForoComponent {
  
  // variable para tomar el id de la modal
  @ViewChild('modal') modal!: AddForoComponent;

  // variable para tomar el id del contenedor principal con scroll
  @ViewChild('contenedorPrincipal') contenedorPrincipal!: ElementRef;

  // variable para guardar los registros de los foros
  foros: any[] = [];

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // variable para tomar el rol de usuario
  rolUsuarioActual!: number;

  private unsubscribe$ = new Subject<void>();

  // responsive de la imagen de la derecha 
  screenSmall = window.innerWidth < 1024;

  // responsive de la imagen de la derecha
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenSmall = event.target.innerWidth < 1024;
  }

  constructor(
    private dialog: MatDialog, 
    private superadminservice: SuperadminService, 
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    // verificamos el rol para sacarlo al login
    if (this.documentoAdministrador) {

      // convertimos la variable a tipo JSON
      var docAdministrador = JSON.parse(this.documentoAdministrador);

      // tomamos el id_rol y lo guardamos aparte
      this.rolUsuarioActual = docAdministrador.id_rol; 

      // verificamos quien puede entrar al modulo
      if(docAdministrador.id_rol != 1 && docAdministrador.id_rol != 2){
        //this.router.navigate(['/login']);
        console.log('saca del sistema normal');
      }
    } else {
      console.log('saca del sistema, no hay json');
      //this.router.navigate(['/login']);
    }

    // Ejemplo de datos que pueden venir de la base de datos
    this.cargarRegistrosforo();
  }

  // abriamos la ventana modal
  openDialog(): void {
    // Variable para abrir la ventana modal
    const dialogRef = this.dialog.open(AddForoComponent);

    // Metodo para recibir la señal emitada desde la modal de agregar el foro
    dialogRef.componentInstance.datosInsertado.subscribe(() =>{

      // llamamos a la funcion que trae los registros de foro
      this.cargarRegistrosforo().then(() =>{

        // revisa si los cambios ya se realizaron
        this.cdRef.detectChanges();

        // llamamos a la funcion para scrollear hacia el ultimo registro de abajo
        this.scrollUltimoRegistro();
      });
    })
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para traer los registros del foro
  cargarRegistrosforo(): Promise<void> {
    // retornamos una promesa para usar al cargar los datos
    return new Promise((resolve) => {
      this.superadminservice.obtenerRegistrosForo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if (!data.mensaje) {
          this.foros = data;
        } else {
          alert('no hay datos');
        }
        resolve();
      });
    })
  }


  // funcion para editar el foro
  editarForoModal(foro: any): void {
    // Variable para abrir la ventana modal y enviarle los datos del 
    const dialogRef = this.dialog.open(AddForoComponent, {
      data: {
        titulo: foro.subtitulo_foro,
        contenido: foro.contenido_foro,
        id: foro.id,
        editar: true
      }
    });

    // al insertar correctamente, se avisa por este medio para realizar una actualizacion de los datos
    dialogRef.componentInstance.datosInsertado.subscribe(() =>{

      // llamamos a la funcion que trae los registros de foro
      this.cargarRegistrosforo();
    })
  }

  // funcion para eliminar un foro
  eliminarRegistroForo (id: any) {
    console.log(id);
    this.superadminservice.eliminiarRegistroForo(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        console.log(data)
        if(data.status == 200){
          this.cargarRegistrosforo();
          alert('Se elimino con exito');
        } else {
          this.cargarRegistrosforo();
          alert('No se pudo eliminar');
        }
      });
  }

  // funcion para scrollear hasta el ultimo registros encontrado
  scrollUltimoRegistro(): void {
    
    // este metodo hace que se active en el siguiente ciclo de animacion
    requestAnimationFrame(() => {
      // con el id del foro le indicamos lo que tiene que hacer en base al ultimo elemento hijo de su contenido
      this.contenedorPrincipal.nativeElement.lastElementChild?.scrollIntoView({
        behavior: 'smooth',   // realizar un desplazamient ma suave   
        block: 'end'          // llegar hasta el ultimo element hijo visible
      });
    });
  }
}
