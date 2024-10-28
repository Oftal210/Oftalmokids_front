import { Component, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

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

  foros: any[] = [];

  hijos: any[] = [];

  private unsubscribe$ = new Subject<void>();

  screenSmall = window.innerWidth < 1024;
  isSmallScreen = window.innerWidth <= 1011;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenSmall = event.target.innerWidth < 1024;
    this.isSmallScreen = event.target.innerWidth <= 1011;
  }

  constructor(private dialog: MatDialog, private superadminservice: SuperadminService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    // Ejemplo de datos que pueden venir de la base de datos
    this.cargarRegistrosforo();
    this.cargarRegistroHijos();
  }

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

    dialogRef.componentInstance.datosInsertado.subscribe(() =>{

      // llamamos a la funcion que trae los registros de foro
      this.cargarRegistrosforo();
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
        this.foros = data;
        resolve();
      });
    })
  }

  cargarRegistroHijos(): void {
    this.superadminservice.obtenerRegistroPaciente()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      console.log(data);
      this.hijos = data;
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
