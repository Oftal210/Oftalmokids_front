import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { NotificacionService } from '../servicios/notificacion.service';
import { AuthService } from '../servicios/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showDropdown = false;
  user:any
  dropDownCampa = false;
  iconoCampanitaVisible: boolean = true;

  // variables para guardar las notificaciones
  notifi: any[] = [];

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // Ruta para redirigir a la persona
  rutaPerfil: string = '';
  nombreperfil: string = '';

  private intervalId: any;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService:AuthService,
    private notifiservice:NotificacionService
  ) {}

  ngOnInit(){
    this.user = this.authService.getUser();
    this.cargarNotificaciones();
    const campanitaOculta = localStorage.getItem('campanitaOculta');
    this.iconoCampanitaVisible = campanitaOculta !== 'true';
  }
  
  // Permite abrir el menú del perfil y cerrar sesión
  toggleDropdown() {
    if(this.dropDownCampa){
      this.dropDownCampa = false
    }
    this.showDropdown = !this.showDropdown;
  }

  // Permite abrir el menú del perfil y cerrar sesión
  toggleDropdownCampanita() {
    if(this.showDropdown){
      this.showDropdown = false
    }
    this.dropDownCampa = !this.dropDownCampa;
    this.iconoCampanitaVisible = false;
    localStorage.setItem('campanitaOculta', 'true');
  }


  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

  }

  // Funcion para cerrar la sesion actual
  cerrarSesion() {
    this.notifiservice.cerrarSesion().subscribe( response => { 
      //Maneja la respuesta de cierre de sesión exitoso 
      //console.log('Sesión cerrada exitosamente', response);
      localStorage.clear();
      sessionStorage.clear();
      // Redirige al login
      this.router.navigate(['/login']);
    }, error => { 
      // Maneja el error que pueda ocurrir 
      //console.error('Error al cerrar la sesión', error); 
    } 
    );
    
  }

  // funcion para traer a los hijos 
  cargarNotificaciones(): void {
    this.notifiservice.obtenerNotificaciones()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(data.status != 404) {
        this.notifi = data.notificacion;
      }
    })
  }

  irForo(){
    this.router.navigate(['/foro']);
  }
  
  // funcion para darle un formato a la fecha
  formatDate(dateString: string): string {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const date = new Date(dateString);
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  }


}
